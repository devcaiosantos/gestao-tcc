interface IJwtStudent{
    exp: number;
    iat: number;
    id: number;
    adminId: number;
    type: string;
}

function parseJwt (token:string): IJwtStudent | null {
    try{
        if(token != null || token != undefined){
            const base64String = token.split(".")[1];
            const decodedValue = JSON.parse(Buffer.from(base64String,"base64").toString("ascii"));
            return decodedValue;
        }
        return null;
    }
    catch(error){
        return null;
    }
}

export default parseJwt;
