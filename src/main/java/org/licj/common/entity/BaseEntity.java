package org.licj.common.entity;

import java.io.Serializable;
import java.util.Date;

import org.licj.common.utils.DateFormatSerializer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

@Data
public class BaseEntity implements Serializable{
	
	private static final long serialVersionUID = 1L;
	@JsonSerialize(using = DateFormatSerializer.class)
	private Date createTime;
	@JsonSerialize(using = DateFormatSerializer.class)
	private Date updateTime;	
}
