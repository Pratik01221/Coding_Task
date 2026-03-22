//employee data (json) write and read contents to the file 
const fs=require('fs');
const filename="emp_data.json"
try{
    const employees=[
        {"ename": "Rohit Sharma",
            "email":"rohit@example.com",
            "job_profile": "developer"},
        {"ename": "Narendra Modi",
            "email":"modi@example.com",
            "job_profile": "PM"},
        {"ename": "Virat Kohli",
            "email":"virat@example.com",
            "job_profile": "cricketer"}
        ];
        fs.writeFileSync(filename, JSON.stringify(employees,null,2));
        console.log("file created");
        if(fs.existsSync(filename)){
            console.log("file does not exit:");
        }
        const data=fs.readFileSync(filename,'utf-8');
        if(!data){
            throw new Error("file is empty");
        }
        console.log("employee data :",data);
    }
catch(err){
    console.log("error occured:",err);
}
