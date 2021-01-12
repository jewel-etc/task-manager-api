const sgMail=require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// sgMail.send({
//     to:'jewel.etc@gmail.com',
//     from:'jewelsendgrid@gmail.com',
//     subject:'My first creation!',
//     text:'hi! Welcome'
// })

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'jewelsendgrid@gmail.com',
        subject:'Thanx for joining in!',
        text:`Welcome ${name}`
    })
}

const sendCancelationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'jewelsendgrid@gmail.com',
        subject:'Sorry to see you go!',
        text:` ${name} , sucessfully delete your accout`
    })
}

module.exports={
    sendWelcomeEmail:sendWelcomeEmail,
    sendCancelationEmail:sendCancelationEmail
}
