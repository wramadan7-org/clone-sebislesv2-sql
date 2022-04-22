const floater = async (data) => {
    if (data && !/[a-zA-Z]/g.test(data)) {
        const splitComa = data.split(',');
        const splitSpace = data.split(' ');
    
        if (splitComa.length == 2) {
            const result = splitComa.join('.');
            
            return result.replace(/\s/g, '');
        };
    
        if (splitSpace.length == 2) {
            const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

            if (format.test(splitSpace[0]) || format.test(splitSpace[1])) {
                const splitFirstArray = splitSpace[0].split(',');

                if (splitFirstArray.length == 2) {
                    return splitFirstArray.join('.');
                };

                if (/./.test(splitSpace[0])) {
                    return splitSpace[0];
                };

                return 0
            }

            const result = splitSpace.join('.');

            return result.replace(/\s/g, '');
        };
    } else {
        return 0;
    }
};

module.exports = {
    floater,
};