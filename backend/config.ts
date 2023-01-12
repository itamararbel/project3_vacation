class Config {
    adminPassword = "123"
    adminUserName="bigsecret"
    // port = process.env.PORT || 3000;
    // mySqlHost =  "eu-cdbr-west-03.cleardb.net" 'sql-server-db';
    // mySqlUser = 'b8bce7a6148c34';
    // mySqlPassword = '1e795775'
    // mySqlDatabase = 'heroku_ce0f5019fea6394'
    // }
        port = 3100;
        mySqlHost =  "localhost"  //'sql-server-db';
        mySqlUser = 'root';
        mySqlPassword = '12345678'
        mySqlDatabase = 'vacation_project'
}

const config = new Config();
export default config;