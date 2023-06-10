// const sequelize=require("../webAppBoardSequelize"); // 🍒db 접속, entity 생성,
const {Sequelize,DataTypes}=require("sequelize"); // sequelize 가 반환하는 여러개 중에서 DataTypes 와 Sequelize 속성을 가져오겠다.
module.exports=(sequelize)=>{ // 🍒db 중복접속 방지 (모듈 내보낼때 sequelize(db 접속) 도 같이 내보내겠다)
    const usersEntity=sequelize.define("usersEntity",{
        // entity : 테이블과 맵핑하는 것!
        u_id:{
            type: DataTypes.STRING(255), // 데이터타입(크기)
            primaryKey:true // pk 제약조건
        },
        pw:{
            type:DataTypes.STRING(255),
            allowNull:false // null 허용X
        },
        name:{
            type:DataTypes.STRING(255),
            allowNull:false // null 허용X
        },
        phone:{
            type:DataTypes.STRING(20),
            allowNull:false, // null 허용X
            unique:true
        },
        img_path:{
            type:DataTypes.STRING(255),
        },
        email:{
            type:DataTypes.STRING(255),
            allowNull:false,
            unique:true
        },
        post_time:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:Sequelize.literal("CURRENT_TIMESTAMP") // Sequelize.literal(실행하고 싶은 함수) // 등록할때 자동으로 current_timestamp 함수실행해준다
        },
        birth:{
            type:DataTypes.DATE,
            allowNull:false
        },
        gender:{
            type:DataTypes.ENUM("FEMALE","MALE","NONE"),
            allowNull:false
        },
        address:{
            type:DataTypes.STRING(255),
        },
        detail_address:{
            type:DataTypes.STRING(255),
        },
        permission:{
            type:DataTypes.ENUM("ADMIN","USER","SILVER","GOLD","PRIVATE"), // Time 이 없는 날짜
            allowNull:false
        },
    }, {
        tableName:"users", // 테이블명 // users 테이블을 orm 으로 맵핑하여 다시 테이블을 생성(usersEntity 로 맵핑) => orm 라이브러리가 entity 를 기반으로 자동으로 쿼리생성
        timestamps:false // timestamps : creat_at(post_time),update_at 두개의 필드가 있다는 전제로 맵핑 하는 것이
    }); // 모델이름,객체
   return usersEntity;
}

// module.exports=usersEntity;

//Object Relationship Mapping (ORM)
//ORM 으로 생성한 table 을 맵핑하는 객체를 Entity 라 부른다.
//entity 는 DTO 와 유사하지만 table 명세가 더 상세하고 ORM 라이브러리가 entity 기반으로 쿼리 생성이 가능
//entity : 타입이 더 명확하고 쿼리를 생성한다