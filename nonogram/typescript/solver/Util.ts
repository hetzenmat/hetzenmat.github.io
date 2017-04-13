class Util {
    static stringToArray(str) {
        let arr = new Array(str.length)
        for (let i = 0; i < str.length; i++) {
            arr[i] = str[i];
        }
        return arr;
    }
    
    static arrayToString(arr, map) {
        let str = '';
        if (!map)
            map = new Map();
        arr.map(elem => {
            let newValue = map.get(elem);
            if (newValue)
                str += newValue;
            else
                str += elem;
        });
        return str;
    }
}