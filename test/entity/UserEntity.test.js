const userEntity=require("../../model/entity/UsersEntity");
describe("UserEntity Test", ()=>{
   test("findAll", async()=>{ // 터미널 테스트 명령어 : npm test
      //console.log("jest 실행하면 되나요?")
      const users=await userEntity.findAll(); // findAll() 함수. 자동으로 SELECT 문을 써준다
      console.log(users);
   });
   test("findAll([u_id,pw,name])", async()=>{
      const users=await userEntity.findAll({
         attributes:["u_id","pw","name"] // 원하는 속성만 선택해서 조회할 수 있다.
      }); // findAll() 함수. 자동으로 SELECT 문을 써준다
      console.log(users);
   });
   test("findAll(where:permission)", async()=>{
      const users=await userEntity.findAll({
         where: {
            permission: "admin"
         }
      }); // findAll() 함수. 자동으로 WHERE 문 을 이용해서 데이터를 찾아준다
      console.log(users);
   });
   test("findAll(paging)",async()=>{
      //ORM 과 페이징 (ORM 라이브러리가 데이터베이스에 맞게 쿼리를 써준다)
      //SQL(쿼리)이 공통규칙이 존재하는데 db 마다 조금씩 차이가 존재하고 특히 paging 과 함수가 많이 다르다.
      //ORM 이 (모든 관계형)데이터 베이스에 맞는 쿼리를 생성하기 때문에 db가 바껴도 쿼리 수정이 필요없다.

      // 데이터베이스 마다 쿼리의 차이 예)
      //ORACLE 의 페이징 : SELECT * FROM (SELECT *, ROWNUM r FROM (SELECT * FROM BOARD) b WHERE ROWNUM<=10) WHERE ROWNUM>=5
      //MYSQL 의 페이징 : SELECT * FROM BOARD LIMIT 5,5
      //ORACLE null data 체크하는 함수 : NVL(칼럼,0)
      //MYSQL null data 체크하는 함수 : IFNULL(칼럼,0)
      //테이블의 row 인덱스번호 == ROWNUM

      const users=await userEntity.findAll({
         where: {permission:"USER"},
         offset:5, // 데이블의 row 인덱스 5부터
         limit:5,   // 5개 까지
         order:[ // 정렬 : 여러개 올수있으니까 배열로
            // 젠더로 정렬, 이후 이름으로 정렬 (여자 에서 이름으로 정렬, 남자에서 이름으로 정렬)
            ["gender","ASC"],
            ["name","ASC"], // 이름으로 오름차순

         ]
      });
       console.log(JSON.stringify(users,"usersEntity",2)); // 어떤것을 출력할건지, key 값, 여백
       // 출력하고 싶은 key 값 usersEntity // space : 필드사이의 여백

   });
   test("findByPk", async()=>{
      const users=await userEntity.findByPk("user06"); // findByPk() 함수. 자동으로 SELECT 문을 써준다
      console.log(users);
   }); // 노드js : 자동으로 쿼리를 생성해주는 ORM

   test("create() 등록",async ()=>{
      const user={
             "u_id": "testUser03",
             "pw": "1234",
             "name": "비공개회원",
             "phone": "999999999993",
             "img_path": "/img/users/testUser03.jpeg",
             "email": "testUser03@gmail.com",
             "birth": "1980-09-18",
             "gender": "MALE",
             "address": "서울특별시",
             "detail_address": "중구",
             "permission": "PRIVATE"
          }
          let result;
          try{
             result=await userEntity.create(user); // 반환하는게 없다 // 시퀄라이즈의 entity 에 create() 함수
          }catch (e){
             console.error(e)
          }
         console.log(result); // 등록실패하면 result 자체가 안뜬다. result == undefined
         // console.log(result._options.isNewRecord); // result 가 undefined 일때 options 하면 오류뜬다
         // options : isNewRecord:true - 새로운 레코드라는 뜻
   });
   test("update 수정",async()=>{
      const user={
         "name": "PRIVATE 회원",
         "phone": "1999999999993",
         "img_path": "/img/users/PRIVATE회원.jpeg",
         "email": "테스트유저03@gmail.com",
         "birth": "1999-09-09",
         "gender": "FEMALE",
         "address": "경기도",
         "detail_address": "중구",
         "permission": "USER"
      }
      let result;
      try{
         result=await userEntity.update(user,{ // user 인데 누구를 바꾼다? 옵션추가!
            where:{u_id:"testUser03"} // user 인데 u_id가 "testUser03" 인 유저를 바꾸겠다.
         });
      }catch (e) {
         console.error(e)
      }
      console.log(result); // 등록성공시 1
   });
   test("destroy 삭제", async()=>{
      let result;
      try{
          result=await userEntity.destroy({
              where:{u_id:"testUser03"}
          });
      }catch (e) {
          console.error(e);
      }
       console.log(result);
   });
});