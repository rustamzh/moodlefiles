export class Token {
    token: String;
    privatetoken: String;

    static isToken(data: String | Token ): data is Token {
        return (<Token>data).token !== undefined && (<Token>data).privatetoken !== undefined;
      }
}
