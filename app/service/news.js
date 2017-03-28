module.exports = app => {
	class NewsService extends app.Service{
		* list(page = 1){
			const { serverUrl, pageSize} = this.app.config.news;
			const { data: idList} = yield this.ctx.curl(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=113.113.121.184`,{
				data:{
					orderBy:'"$key"',
					startAt:`"${pageSize * (page - 1)}"`,
					endAt:`"${pageSize * page - 1}"`
				},
				dataType:'json'
			});
			const newsList = yield Object.keys(idList).map(key => {
				const url = `${serverUrl}/item/${idList[key]}.json`;
				return this.ctx.curl(url, {dataType:'json'});
			});
			return newsList.map(res => res.data);
		}
	}
	return NewsService;
};
