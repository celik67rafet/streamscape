// değişkenler undefined kalabilir çünkü constructorda veya başlangıçta değer vermedin. Bu yüzden ünlem koy!
export class RegisterUserDto{
    email!: string;
    passwordHash!: string;
    displayName!: string;
}