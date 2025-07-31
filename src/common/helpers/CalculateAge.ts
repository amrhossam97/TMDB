import * as moment from "moment";

export  const calculateAge =(birthday) =>{
    console.log('birthdate : ', birthday);
    console.log(moment(birthday, 'DD-MM-YYYY', true));
    
    let birthdate;
      if (moment(birthday, 'DD-MM-YYYY', true).isValid()) {
        const birth = birthday.split('-');
        birthdate = new Date(birth[2], birth[1] - 1, birth[0]);
      } else if(moment(birthday, 'YYYY-MM-DD', true).isValid()){
        const birth = birthday.split('-');
        birthdate = new Date(birth[0], birth[1] - 1, birth[2]);
      }
    
    else birthdate = new Date(birthday);
    // Calculate age from 30/6 in this year
    let currentDate= new Date()
    let beforSubscribtionDate = new Date(currentDate.getFullYear(), 6, 1,-22);
      console.log("beforSubscribtionDate11",beforSubscribtionDate);
      let ageDifMs
    // let birthdate = new Date(birthday);
    if(currentDate > beforSubscribtionDate){
      ageDifMs = beforSubscribtionDate.getTime() - birthdate.getTime();
      console.log("ageDifMs",ageDifMs);
    }
    else
      ageDifMs = currentDate.getTime() - birthdate.getTime();
    let ageDate = new Date(ageDifMs);
    console.log('agee : ', Math.abs(ageDate.getUTCFullYear() - 1970));
    if (Math.abs(ageDate.getUTCFullYear() - 1970) === 0) return 1;
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }


  export  const returnBirhdate =(birthday) =>{
    console.log('birthdate : ', birthday);
    let birthdate;
      if (moment(birthday, 'DD-MM-YYYY', true).isValid()) {
        const birth = birthday.split('-');
        birthdate = new Date(birth[2], birth[1] - 1, birth[0]);
        console.log("f",birthdate)

      } else if(moment(birthday, 'YYYY-MM-DD', true).isValid()){
        const birth = birthday.split('-');
        birthdate = new Date(birth[0], birth[1] - 1, birth[2]);
        console.log("s",birthdate)

      }
      else {
    
       birthdate = new Date(birthday);

      }
      return birthdate;
    }