/**
 * package com.cds.common.dao;
 * File Name:BaseDao.java
 * Package Name:com.cds.common.dao
 * Date:2015年3月16日 上午10:56:33
 * Author:gaows
 * Copyright (c) 2014, gaows All Rights Reserved.
 *
 */

package org.licj.common.dao;

import java.io.Serializable;
import java.util.List;

import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.SelectProvider;
import org.licj.common.entity.BaseEntity;

public interface BaseDao<T extends BaseEntity> extends Serializable {

	public Long save(T ob);

	public Long update(T ob);

	public T getById(Long id);

	public Integer delete(Long id);
}
