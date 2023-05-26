export const shortAddress = (addr) => {
    let startChar = addr.substring(0, 6);
    let endChar = addr.substring(addr.length - 7, addr.length - 1);
    return startChar + '....' + endChar;
};
