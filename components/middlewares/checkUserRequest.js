exports.checkUserRequest = (user) => {
    if (user === 'admin') {
        return '';
    }
    return user;
}
