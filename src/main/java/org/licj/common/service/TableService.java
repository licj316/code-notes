/**
 * package com.cds.contract.service;
 * File Name:BillService.java
 * Package Name:com.cds.contract.service
 * Date:2015年10月26日 下午3:57:57
 * Author:gaows
 * Copyright (c) 2014, gaows All Rights Reserved.
 *
*/

package org.licj.common.service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.licj.common.utils.TableUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class TableService {
	
	@Autowired
	private SqlSessionFactory sqlSessionFactory;
	
	public static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	public static final SimpleDateFormat fileNameDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	private static final Logger log = LoggerFactory.getLogger(TableService.class);

	public Map<String, Object> getTableData(Map<Object, Object> vo) throws Exception {
		TableUtils.startPage(vo);
		SqlSession session = sqlSessionFactory.openSession();
		if (vo.get("queryMapper") == null || "".equals(vo.get("queryMapper").toString())) {
			throw new Exception("请定义数据源queryMapper!");
		}
		List<Map<String, Object>> resultList = session.selectList(vo.get("queryMapper").toString(), vo);
		session.close();
		return TableUtils.getTableData(vo, resultList);
	}
	
	public void exportExcel(HttpServletResponse response, String exportConfig, Long currUserId){
		ObjectMapper objectMapper = new ObjectMapper();
		SqlSession session = sqlSessionFactory.openSession();
		try {
			Map<String, Object> configMap = objectMapper.readValue(exportConfig, Map.class);
			String excelName = configMap.get("excelName").toString();
			//映射数据字典
			List<Map<String, Object>> columnsTransferList = (List<Map<String, Object>>)configMap.get("columnsTransfer");
			Map<String, Map<String, Object>> fieldDictMap = new HashMap<>();
			
			Map<String, Object> tmpDictMap;
			
			for(Map<String, Object> map : columnsTransferList){
				tmpDictMap = new HashMap<>();
				for(Map<String, Object> tmpMap : (List<Map<String, Object>>)map.get("dict")){
					tmpDictMap.put(tmpMap.get(map.get("fromAttr") == null ? "id" : map.get("fromAttr").toString()).toString(),
							tmpMap.get(map.get("toAttr") == null ? "id" : map.get("toAttr").toString()));
				}
				fieldDictMap.put(map.get("name").toString(), tmpDictMap);
			}
			
			//1、查询导出结果集
			Map<String, Object> paramsMap = (Map<String, Object>)configMap.get("params");
			paramsMap.put("currUserId", currUserId);
			List<Map<String, Object>> resultList = session.selectList(configMap.get("queryMapper").toString(), paramsMap);
			//2、创建Excel
			List<Map<String, Object>> columnsList = (List<Map<String, Object>>)configMap.get("columnsConfig");
			
			HSSFWorkbook wb = new HSSFWorkbook();
			HSSFSheet sheet = wb.createSheet(excelName);
			HSSFRow row = sheet.createRow((int) 0);
			
			HSSFCellStyle style = wb.createCellStyle();
			style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			
			//写入Excel标题行
			HSSFCell cell;
			Map columnMap;
			int columnLen = columnsList.size();
			for(int i = 0; i < columnLen; i++){
				cell = row.createCell((short)i);
				columnMap = columnsList.get(i);
				cell.setCellValue(columnMap.get("header").toString());
				cell.setCellStyle(style);
			}
			
			//3、写入数据到Excel
			Object tempCellValue;
			if(resultList != null && resultList.size() > 0){
				int resLen = resultList.size();
				Map<String,Object> rowMap;
				for(int i = 0; i < resLen; i++){
					row = sheet.createRow((int)(i+1));
					rowMap = resultList.get(i);
					for(int ii = 0; ii < columnLen; ii++){
						columnMap = columnsList.get(ii);
						tempCellValue = rowMap.get(columnMap.get("field"))== null ? "" : rowMap.get(columnMap.get("field")).toString();
						if(fieldDictMap.containsKey(columnMap.get("field").toString())){
							tempCellValue = fieldDictMap.get(columnMap.get("field").toString()).get(tempCellValue);
						}
						row.createCell((short)ii).setCellValue(tempCellValue == null ? "" : tempCellValue.toString());
					}
				}
			}
			
			// 设置response参数，可以打开下载页面
			response.reset();
			response.setContentType("application/vnd.ms-excel;charset=utf-8");
			excelName = excelName + "_" + fileNameDateFormat.format(new Date()) + ".xls";
			response.setHeader("Content-Disposition", "attachment;filename=" + new String(excelName.getBytes(), "iso-8859-1"));
			ServletOutputStream out = response.getOutputStream();
			try{
				wb.write(out);
			} catch (final IOException e) {
				throw e;
			} finally {
				if(wb != null)
					wb.close();
				if (out != null)
					out.close();
			}
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally{
			session.close();
		}
		
	}
}
