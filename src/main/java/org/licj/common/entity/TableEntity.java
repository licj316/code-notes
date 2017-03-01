package org.licj.common.entity;

import java.io.Serializable;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Data;

/**
 * role
 * 
 * @author henry
 *
 * @since 2015-04-17
 */
@Data
@JsonIgnoreProperties(ignoreUnknown=true)
public class TableEntity extends BaseEntity {
	
	
}
