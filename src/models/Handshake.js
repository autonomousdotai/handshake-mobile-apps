class Handshake {
  static handshake(data) {
    return {
      contractFile: data.contractFile || '',
      contractFileName: data.contractFile_name || '',
      deliveryDate: data.delivery_date || '',
      description: data.description || '',
      escrowDate: data.escrow_date || '',
      fromAddress: data.from_address || '',
      fromEmail: data.from_email || '',
      hid: data.hid || '',
      id: data.id || '',
      industriesType: data.industries_type || '',
      public: data.public || '',
      signedContractFile: data.signedContractFile || '',
      source: data.source || '',
      status: data.status || '',
      term: data.term || '',
      toAddress: data.to_address || '',
      toEmail: data.to_email || '',
      userIdShaked: data.user_id_shaked || '',
      slug: data.slug || '',
    };
  }
}

export default Handshake;
