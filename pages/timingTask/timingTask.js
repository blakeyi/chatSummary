Page({
    data: {
      value: '',
    },
    onChange(e) {
      this.setData({
        searchStr: e.detail,
      });
    },
    onSearch() {
      Toast('搜索' + this.data.searchStr);
    },
    onClick() {
      Toast('搜索' + this.data.searchStr);
    },
  });