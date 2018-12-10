const VerificationUtils = class VerificationUtils {

    static verifParameters(body, parameters) {
        let params = {};
        parameters.forEach((parameter) => {
            const verifObject = verificationObjects.find((verifObject) => {
                if (verifObject.type === parameter.type) {
                    return true;
                }
            });
            verifObject.verif(body[parameter.name], parameter);
            if (body[parameter.name]) {
                params[parameter.name] = body[parameter.name];
            }
        });
        return params;
    }

    static updateVerifParameters(body, parameters) {
        const params = {};
        var count = 0;
        parameters.forEach((parameter) => {
            const verifObject = verificationObjects.find((verifObject) => {
                if (verifObject.type === parameter.type) {
                    return true;
                }
            });
            parameter.needed = false;
            verifObject.verif(body[parameter.name], parameter);
            if (body[parameter.name]) {
                count++;
                params[parameter.name] = body[parameter.name];
            }
        });
        if (count === 0) {
            throw new Error("At least one parameter");
        }
        return params;
    }

    static verifNumber(number, parameter) {
        const { min, max, needed } = parameter;
        if (!number && needed === true) {
            throw new Error(`Missing parameter ${parameter.name}`);
        }
        if (!number && needed === false) {
            return ;
        }
        if (number < min || number > max) {
            throw new Error(`${parameter.name} has an invalid value, must be between ${min} and ${max}`)
        }
        return ;
    }

    static verifString(string, parameter) {
        const { min, max, needed } = parameter;
        if (!string && needed === true) {
            throw new Error(`Missing parameter ${parameter.name}`);
        }
        if (!string && needed === false) {
            return ;
        }
        if (string.length < min || string.length > max) {
            throw new Error(`${parameter.name} has an invalid size, must be between ${min} and ${max}`)
        }
        return ;
    }
}

const verificationObjects = [
    { type: 'number', verif: VerificationUtils.verifNumber },
    { type: 'string', verif: VerificationUtils.verifString },
]

module.exports = VerificationUtils;