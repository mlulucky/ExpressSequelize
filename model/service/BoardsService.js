// 🍒하나의 sequelize 에서 여러 Entity 를 정의할 수 있다. db 접속 한번만
const sequelize=require("../webAppBoardSequelize"); // // db 접속은 한번만
const boardsEntity=require("../entity/BoardsEntity")(sequelize); // require 실행하면서 sequelize db 불러오기
// 🍒BoardService 에서 userEntity 조인
const usersEntity=require("../entity/UsersEntity")(sequelize); // 보드서비스 파일이 속한 폴더에 한칸뒤에 entity 폴더
const boardRepliesEntity=require("../entity/BoardRepliesEntity")(sequelize);
// 소문자는 객체. 대문자는 타입!
const PageVo=require("../vo/PageVo");
class BoardService{
    async detail(bId){
        //boardRepliesEntity 를 만들어서 BoardService.detail 을 호출할때
        //=>리플리스트를 지연로딩 구현하라

        // 🍒보드와 유저 조인 관계설정 Boards : Users = N : 1  (belongsTo)   // 유저 한명이 게시글 여러개 작성가능. 게시글 입장에서는 유저는 한명
        // 🍒belongsTo, hasMany => 조인 관계설정
        // 🍒서비스에서 include 로 즉시조인하지 않아도, 호출을 하면 (toString, get()) 지연로딩으로 조인되어 불러와진다.

        // usersEntity == sequealize.models.usersEntity
        // sequelize 에 models usersEntity가 저장된다 // 어디서 ?=> const usersEntity=sequelize.define("usersEntity",{})
        boardsEntity.belongsTo(usersEntity,{ // 대상, 옵션 // belongsTo => 1 : N 관계
        // boardsEntity.belongsTo(sequelize.models.usersEntity,{
            foreignKey : "u_id", // u_id 를 참조 // users 를 참조하는 boards 의 외래키
            as: "user" // JOIN or 지연로딩일 때 user 를 가져왔을 때 boards 에 생성되는 필드
            // boards 에 user 라는 필드가 생성된다.
        }) ;
        // 🍒Boards : Replies = 1 : N (hasMany) // board 입장에서
        // 🔥**지연로딩이든 즉시로딩이던 참조관계 설정은 무조건 적어야한다.
        // board 와 board 댓글 참조관계 설정
        boardsEntity.hasMany(boardRepliesEntity,{
            foreignKey:"b_id", // board_replies 를 참조하는 boards 의 외래키
            as: "replies",
            // where:{parent_br_id:null} // 대댓글 제외 => 대댓글은 제외가 안된다! 왜? 지연로딩은 조건을 줄 수 없다. 조건이 안먹힌다
            // 🍒==> 따라서 댓글만 출력하는 방법으로 include 즉시로딩으로 조인을 시킴
        })
        //** 셀프조인 - 댓글 - 대댓글
        //replies(br_id) : replies(parent_br_id) : 1 : N (댓글 : 대댓글)
        boardRepliesEntity.hasMany(boardRepliesEntity,{ // 셀프조인 - 내가(댓글이) 내자신(댓글)을 참조
           foreignKey: "parent_br_id", // 댓글을 참조하는 대댓글의 외래키
            as: "replies",
        });

        //findOne() :  무조건 한개의 결과를 반환
        const board=await boardsEntity.findOne({
            where : {
                b_id : bId
            },
            include:[ // 🍒즉시로딩(where 조건문을 쓸수 있다) // 실제 조인하는 구문, belongsTo 는 조인 관계설정 // 여러개 조인할수 있어서 배열로
                {
                    foreignKey:"b_id",
                    model: boardRepliesEntity,
                    as : "replies",
                    required: false, // 댓글이 없을 수도 있어서 // 댓글이 없는 게시글도 출력(🍒left join)
                    where: { parent_br_id:null },

                    include : [{ // 셀프조인 - 대댓글,대대댓글...
                        targetKey:"br_id",
                        foreignKey:"parent_br_id",
                        model : boardRepliesEntity, // 내가 내 자신을 참조
                        as: "replies",
                        required: false
                    }]
                }
            ]
            // 🍒실제 조인하는 구문!
            // 🍒include 옵션을 사용하면 Eager Loading(즉시로딩) 조인으로 user 를 불러온다. 즉시 조인!
           /* include:[ // 여러개 조인할수있어서 배열 => 보드서비스테스트에서 지연로딩 실행!
                {
                    model: usersEntity, // user 테이블
                    as: "user",
                    required: false, // true : inner Join, false : Left Join
                    // attributes:["email","name"] // 조인해서 이메일, 이름만 출력하겠다! // 몇개만 조인하고 싶으면 출력하고 싶은것을 적는다
                }
            ]*/
        });
        return board
    }
    // async list(pagingVo){
    //     const boards=await boardsEntity.findAll();
    //     return boards;
    // }
    
    async list(reqParams){ // reqParams : 파라미터
        let whereObj={}; // 조건문
        const orderArr=[];
        if(reqParams.field && reqParams.value){
            whereObj[reqParams.field]=reqParams.value;  // WHERE status="PUBLIC"
            // whereObj 객체에 값이 reqParams.value 인 reqParams.field 속성을 추가
            // 조건은 reqParams.field 변수의 속성이 먼저 정의가 되어있어야 사용가능하다.
            // whereObj = {"reqParams.field" : "reqParams.value"}
        }//{"status":"PUBLIC"} // test.js 에서 설정
        if(reqParams.orderField && reqParams.orderDirect){
            orderArr.push(reqParams.orderField); // orderArr 에 값 추가
            orderArr.push(reqParams.orderDirect); // 정렬 // [].push("a") => ["a"],  push("b")=>["a","b"]
            // ["gender","ASC"]
        }
        const totalCnt=await boardsEntity.count({
            where: whereObj // where 조건문 추가
        });
        const pageVo=new PageVo(reqParams.page,totalCnt,reqParams,3); // rowLength 한페이지 출력 개수

        const boards=boardsEntity.findAll({
            offset:pageVo.offset,
            limit:pageVo.rowLength,
            where:whereObj, // {"status : "PUBLIC"}
            order:[orderArr] // 정렬 // [orderArr1, orderArr2 ... ] 배열이므로 여러개 추가 가능
        });
        boards.pageVo=pageVo;
        console.log(JSON.stringify(pageVo.totalRow)) // == count 페이징으로 출력되는 개수
        return boards;

    }
}
module.exports=BoardService;