exports.Pagination = async (pageNo, size) => {
    return {
        skip: size * (pageNo - 1),
        limit: parseInt(size)
    };
}

exports.DataPagination = async (content, size, pageNo) => {
    const totalPage = await Math.ceil(content.length / size)
    const hasNextPage = await pageNo < totalPage
    const hasPrevPage = await totalPage > 1 && pageNo > 1
    return { totalPage: totalPage, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage };
}

exports.paginate = async (array, pageSize, pageNumber) => {
    --pageNumber; // because pages logically start with 1, but technically with 0
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}

function getTitle(a, b, property) {
    if (a[property] < b[property]) {
        return -1;
    }
    return (a[property] > b[property]) ? 1 : 0;
}

exports.dynamicSort = (property) => {
    const sortOrder = 1;
    return function (a, b) {
        const result = getTitle(a, b, property);
        return result * sortOrder;
    }
}
