const {Sequelize}=require("sequelize");
// mysql2 모듈을 사용해서 접속이 가능하고 mysql2.pool 을 사용 가능
// db 접속은 sequelize 모듈이 직접한다. (mysql2 를 불러오지 않아도 된다)
// sequelize : orm(ObjectRelationMapping) 기반으로 정의한 entity 로 query 를 생성하는 모듈
const sequelize=new Sequelize("webAppBoard","boardServerDev","mysql123",{ // db, 계정, pw
    host:"localhost", // ip
    port:3306,
    dialect:"mysql", // 어떤 데이터베이스에 접속할것인가
    pool:{ // 커넥션 풀
        max:5, // 최대 5명까지 접속가능
        min:0, // 접속이 없어도 접속(pool)을 유지해라
        acquire: 30000, // db 접속, 커넥션을 하는데 까지 기다려주는 시간  // 밀리세컨즈
        idle:10000, // db 에서 데이터를 가져오는데 까지 기다리는 시간
    },
    logging:true, // 자동으로 생성하는 쿼리를 로그로 출력(성능저하가 있기 때문에 배포시 false, 개발할때만 true)
}); // 데이터베이스, 계정, 비밀번호, 객체
module.exports=sequelize;