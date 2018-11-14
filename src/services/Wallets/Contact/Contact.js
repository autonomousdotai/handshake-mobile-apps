

export class Contact{
  constructor(name, email, addresses) {        
    this.name = name;
    this.email = email;
    this.addresses = addresses;
  }
  addContactAddress(conTactAddress){
    this.addresses.push(conTactAddress);
  }
}
export default { Contact };