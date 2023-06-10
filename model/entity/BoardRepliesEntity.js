const {Sequelize,DataTypes}=require("sequelize");
module.exports=function BoardReplies(sequelize) {
    const boardsRepliesEntity=sequelize.define("boardsRepliesEntity",{
        br_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        b_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "boardsEntity",
                key: "b_id",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        },
        u_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: "usersEntity",
                key:"u_id",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        },
        parent_br_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model:"boardRepliesEntity",
                key: "br_id",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        },
        post_time: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
        },
        update_time: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
        },
        status: {
            type: DataTypes.ENUM("PUBLIC", "PRIVATE", "REPORT","BLOCK"),
            defaultValue: "PUBLIC"
        },
        img_path: {
            type: DataTypes.STRING(255)
        },
        content: {
            type: DataTypes.TEXT,
            // 시퀄라이즈에서는 데이터타입 미디움텍스트가 없어서 텍스트로 대체! (모든 데이터베이스가 동일한 데이터타입을 가지진 않는다.)
            allowNull: false
        }

    }, {
        tableName: "board_replies",
        timestamps: false
    });
    return boardsRepliesEntity;
}