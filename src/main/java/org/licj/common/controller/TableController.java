package org.licj.common.controller;


import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.licj.common.service.TableService;
import org.licj.common.vo.JSONParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@RequestMapping("/table")
public class TableController {

	private static final Logger log = LoggerFactory
			.getLogger(TableController.class);
	
	@Resource(name = "tableService")
	private TableService tableService;
	
	@RequestMapping(value = "/getTableData")
	public Map<String, Object> getTableData(@RequestBody JSONParam[] jsonParamArr, HttpServletRequest request, HttpServletResponse response) throws Exception {
		log.info("getTableData request");
		Map<String, Object> resultMap = null;
		try {
			Map<Object, Object> vo = new HashMap<Object, Object>();
			if(jsonParamArr.length > 0){
				for(JSONParam jsonParam : jsonParamArr){
					vo.put(jsonParam.getName(), jsonParam.getValue());
				}
			}
			//控制权限--插入当前用户
			//Long currUserId = UserUtils.getCurrUserIdByCookie(request);
			//vo.put("currUserId", currUserId);
			resultMap = tableService.getTableData(vo);
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			log.error(
					"getTableData request error with  vo={} , error={}",
					new Object[] { jsonParamArr, e.getStackTrace() });
			return resultMap;
		}
	}
	
	@RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
	public void exportExcel(HttpServletRequest request, HttpServletResponse response) {
		String exportConfig = request.getParameter("exportConfig");//new String(request.getParameter("exportConfig").getBytes("iso-8859-1"), "utf-8");
		//Long currUserId = UserUtils.getCurrUserIdByCookie(request);
		tableService.exportExcel(response, exportConfig, 0L);
	}
}
