SELECT
	(SELECT COUNT(*) FROM mooc.courses) as mooc_courses_count,
	(SELECT COUNT(*) FROM shop.courses) as shop_courses_count,
 	(SELECT COUNT(*) FROM mooc.courses) - (SELECT COUNT(*) FROM shop.courses) as difference;
