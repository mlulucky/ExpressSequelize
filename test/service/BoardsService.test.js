const BoardService=require("../../model/service/BoardsService");
const boardService=new BoardService();
describe("BoardsService test", ()=>{
    test("list", async ()=>{
        // let page=1;
        let reqParams={ // 파라미터
          field:"status", // 검색할 컬럼
          value:"PUBLIC", // 검색할 값
          page:"1",
          orderField:"b_id", // 정렬
          orderDirect:"DESC"

        };

        // const boards=await boardService.list();
        // console.log(boards);

        // const pageVo=new PageVo()
        const boards=await boardService.list(reqParams);
        console.log(JSON.stringify(boards,"boardsEntity",2)); // 출력되는게 많아서 Entity 만 보려고 JSON.stringify 한 것
   });
    test("detail join 테스트", async ()=>{
       // {boardsEntity: {b_id: 6, title:"", ....}}

        // 🍒user를 호출 .getUser() 할 때 lazy Loading 지연로딩이 발생(게으른 연산!) => join 으로 불러온다.
        // 🍒const user=await board.getUser();
        // 🍒user 를 필요한때만 조회하기 때문에 데이터 낭비(join)가 없다.
        // 🍒단점: join 보다 느리다.
        // 즉시 로딩(바로 조인)
        // SELECT b.*,u.name,u.email FROM boards b INNER JOIN users u USING(u_id) WHERE b_id=1;
        // 지연 로딩(지연 조인) : 보드를 출력하고 다시 유저를 출력하는 조인과 같다
        // SELECT * FROM boards WHERE b_id=1;
        // SELECT * FROM users WHERE u_id='user01'

        const board=await boardService.detail(1);
        console.log(JSON.stringify(board,"boardsEntity",2));

        const user=await board.getUser(); // 🍋호출시 조인 (지연로딩)
        console.log(JSON.stringify(user,"usersEntity",2))

        const replies=await board.getReplies(); // 🍋호출시 조인 (지연로딩)
        console.log(JSON.stringify(replies,"boardsRepliesEntity",2));

        for(reply of replies){
            const rereply=await reply.getReplies();
            console.log(JSON.stringify(rereply, "boardsRepliesEntity", 2));
        }




    });
});