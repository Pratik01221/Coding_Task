import es from "xlsx";
import fs from "fs";

const filename="stud_data.xlsx"

try{
  const  student=[
    {
      "name":"dipak",
      "age":30,
      "weight":55

    },
    {
      "name":"dipak",
      "age":30,
      "weight":55
    },
      {
      "name":"dipak",
      "age":30,
      "weight":55
    }
  ]
  const ws=es.utils.json_to_sheet(student);
  const wb=es.utils.book_new()
  es.utils.book_append_sheet(wb,ws,"students-sheet1");
  es.writeFile(wb,filename)
  console.log("file created")
}
catch(err){

}