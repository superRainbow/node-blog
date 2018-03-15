const page = function (articles, currentPage ) {
    // 分頁
    const data = [];
    const totalArticles = articles.length;
    const nowPage = currentPage;
    const pageSize = 2;
    const totalPages = Math.ceil(totalArticles / pageSize);
    if (nowPage > totalPages) {
        nowPage = totalPages;
    }

    const startItem = (nowPage * pageSize) - pageSize + 1;
    const endItem = nowPage * pageSize;
    articles.forEach((item, i) => {
        const nowItem = i + 1;
        if (nowItem >= startItem && nowItem <= endItem) {
            data.push(item);
        }
    });

    const page = {
        totalPages,
        nowPage,
        hasPre: nowPage > 1,
        hasNext: nowPage < totalPages
    };

    return {
        page,
        data
    }
}

module.exports = page;