export async function generateRandomPassword(
    fullName: string,
    email: string
): Promise<string> {
    const namePart = fullName ? fullName.split(" ")[0] : email.split("@")[0];
    const sanitizedPart = namePart.replace(/[^a-zA-Z0-9]/g, "");

    const uppercase = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const lowercase = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const number = String.fromCharCode(48 + Math.floor(Math.random() * 10));
    const specialChars = "@$!%*?&";
    const special = specialChars[Math.floor(Math.random() * specialChars.length)];

    const randomNumbers = Math.floor(10000 + Math.random() * 90000); 

    const tempPassword = `Trimly${sanitizedPart}${uppercase}${lowercase}${number}${special}${randomNumbers}`;

    return tempPassword; 
}
