// const sequelize=require("../webAppBoardSequelize"); // 🍒db 접속
const {Sequelize, DataTypes}=require("sequelize"); //  데이터 타입, Sequelize 필요

// const boardsEntity = sequelize.define("boardsEntity",{})
// => 1. 🍒sequelize models 의 필드(이름)로 boardsEntity 가 생기고 명시된 const boardsEntity 를 참조한다.
// console.log(boardsEntity===sequelize.model.boardsEntity)
// => 2. 🍒SELECT 시 테이블의 별칭으로 사용한다.
// SELECT * FROM boards as boardsEntity
module.exports=(sequelize)=> { // 🍒db 접속
    // console.log(boardsEntity===sequelize.model.boardsEntity)
    // SELECT * FROM boards as boardsEntity
    const boardsEntity = sequelize.define("boardsEntity", { // define : entity 를 정의하다
        b_id: {
            type: DataTypes.INTEGER.UNSIGNED, // INTEGER == int // USIGNED 마이너스가 없는것
            primaryKey: true,
            autoIncrement: true, // 자동생성
        },
        u_id: {
            type: DataTypes.STRING(255),
            allowNull: false, // null 이면 안됨 // 글쓴이는 무조건 존재해야함
            references: { // 외래키, 참조키
                model: "usersEntity", // 테이블명이 아니라 모델명
                key: "u_id",  // usersEntity 가 갖고있는 pk
                onDelete: "CASCADE", // Entity 간에 조인을 할 수 있다~!
                onUpdate: "CASCADE"
            }
        },
        post_time: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") // 기본값으로 CURRENT_TIMESTAMP 함수실행
        },
        update_time: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") // update 등록할때, 수정할때
        },
        status: {
            type: DataTypes.ENUM("PUBLIC", "PRIVATE", "REPORT", "BLOCK"),
            defaultValue: "PUBLIC", // 기본값 PUBLIC
        },
        title: {
            type: DataTypes.STRING(255)
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false // null 허용
        },
        view_count: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0 // 기본값 0
        }
    },
    {
        tableName: "boards",
        timestamps: false // timestamps 가 없다는 전제
    });
    //console.log(boardsEntity===sequelize.models.boardsEntity)
    //sequalize 의 모델의 필드로 추가됨
    return boardsEntity;
}