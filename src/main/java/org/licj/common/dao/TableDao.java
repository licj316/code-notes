package org.licj.common.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.licj.common.entity.TableEntity;
import org.springframework.stereotype.Repository;


@Repository
public interface TableDao extends BaseDao<TableEntity>{
	
}
