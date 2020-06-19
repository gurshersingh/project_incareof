export function getNameAttributes(name) {
    let _name = [];
    if (typeof name !== "undefined") {
        _name = name.split(" ");
    }
    if (_name.length === 0) {
        return {
            first_name: null,
            last_name: null,
        };
    } else if (_name.length === 1) {
        return {
            first_name: _name[0],
            last_name: null,
        };
    } else {
        return {
            first_name: _name[0],
            last_name: _name[_name.length - 1],
        };
    }
}
