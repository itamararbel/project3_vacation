class Config {
    adminPassword = "123"
    adminUserName="bigsecret"
    port = 3002;
    mySqlHost = 'localhost';
    mySqlUser = 'root';
    mySqlPassword = '12345678'
    mySqlDatabase = 'vacation_project'
}

const config = new Config();
export default config;