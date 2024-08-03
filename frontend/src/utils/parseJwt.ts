interface IJwt{
    exp: number;
    iat: number;
    emailSistema: string;
    chaveEmailSistema: string;
    nome: string;
    email: string;
    id: number;
}
function parseJwt (token:string): IJwt | null {
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
