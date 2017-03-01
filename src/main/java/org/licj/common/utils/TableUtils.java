package org.licj.common.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.licj.common.vo.JSONParam;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

public class TableUtils {
	/**
	 * 开始分页方法
	 * @param vo
	 */
	public static void startPage(Map<Object, Object> vo){
		if(vo.get("iDisplayStart") != null && vo.get("iDisplayLength") != null){//分页状态查询
			int iDisplayStart = Integer.valueOf(vo.get("iDisplayStart").toString());
			int iDisplayLength = Integer.valueOf(vo.get("iDisplayLength").toString());
			int iStartPage = iDisplayStart/iDisplayLength + 1;
			PageHelper.startPage(iStartPage, iDisplayLength);
		}
	}
	/**
	 * 转换表格参数类型为Map类型
	 * @param jsonParamArr
	 * @return
	 */
	public static Map<Object, Object> convertJSONParamArrayToMap(JSONParam[] jsonParamArr){
		Map<Object, Object> vo = new HashMap<Object, Object>();
		if(jsonParamArr.length > 0){
			for(JSONParam jsonParam : jsonParamArr){
				vo.put(jsonParam.getName(), jsonParam.getValue());
			}
		}
		return vo;
	}
	/**
	 * 返回表格数据
	 * @param vo
	 * @param list
	 * @return
	 */
	public static Map<String, Object> getTableData(Map<Object, Object> vo, List<Map<String, Object>> list){
		Map<String, Object> dataMap = new HashMap<String, Object>();
		if(vo.get("iDisplayStart") != null && vo.get("iDisplayLength") != null){//分页状态查询
			PageInfo pageInfo = new PageInfo(list);
			Long total = pageInfo.getTotal();
			dataMap.put("sEcho", "查询成功！");
			dataMap.put("iTotalRecords", total);
			dataMap.put("iTotalDisplayRecords", total);
		}
		dataMap.put("aaData", list);
		return dataMap;
	}
	
	
	public static Map<String, Object> getTableDataNoPage(Map<Object, Object> vo, List<Map<String, Object>> list){
		Map<String, Object> dataMap = new HashMap<String, Object>();
		int total = list.size();
		dataMap.put("sEcho", "查询成功！");
		dataMap.put("iTotalRecords", total);
		dataMap.put("iTotalDisplayRecords", total);
		dataMap.put("aaData", list);
		return dataMap;
	}
	/**
	 * 返回表格数据（new）
	 * @param vo
	 * @param list
	 * @return
	 */
	public static Map<String, Object> getTableDataNew(Map<Object, Object> vo, List<Map<String, Object>> list){
		Map<String, Object> dataMap = new HashMap<String, Object>();
		PageInfo pageInfo = new PageInfo(list);
		Long total = pageInfo.getTotal();
		dataMap.put("draw", vo.get("draw"));
		dataMap.put("recordsTotal", total);
		dataMap.put("recordsFiltered", total);
		dataMap.put("data", list);
		return dataMap;
	}
}



/*int iDisplayStart = Integer.valueOf(vo.get("start").toString());
int iDisplayLength = Integer.valueOf(vo.get("length").toString());
int iStartPage = iDisplayStart/iDisplayLength + 1;
PageHelper.startPage(iStartPage, iDisplayLength);
List<Map<String, Object>> list = gatheringDao.getGatherings(vo);
return TableUtils.getTableDataNew(vo, list);*/


//String gatheringData = vo.get("gatheringData");
//List<Map<String, Object>> list = JSONUtil.json2Obj(gatheringData, new TypeReference<List<Map<String, Object>>>(){});