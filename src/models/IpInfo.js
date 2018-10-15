class IpInfo {
  static ipInfo(data) {
    return {
      ip: data.ip || '',
      city: data.city || '',
      region: data.region || '',
      regionCode: data.region_code || '',
      country: data.country || '',
      countryName: data.country_name || '',
      continentCode: data.continent_code || '',
      inEu: data.in_eu || '',
      postal: data.postal || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      timezone: data.timezone || '',
      utcOffset: data.utc_offset || '',
      countryCallingCode: data.country_calling_code || '',
      currency: data.currency || '',
      languages: data.languages || '',
      asn: data.asn || '',
      org: data.org || '',
      addressDefault: '',

    };
  }

  static ipFind(data) {
    return {
      ip: data.ip_address || '',
      city: data.city || '',
      region: data.region || '',
      regionCode: data.region_code || '',
      country: data.country_code || '',
      countryName: data.country || '',
      continentCode: data.continent_code || '',
      continent: data.continent || '',
      inEu: data.in_eu || '',
      postal: data.postal || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      timezone: data.timezone || '',
      utcOffset: data.utc_offset || '',
      countryCallingCode: data.country_calling_code || '',
      currency: data.currency || '',
      languages: data.languages || [],
      asn: data.asn || '',
      org: data.org || '',
      addressDefault: '',
      county: data.county || '',
      owner: data.owner || '',
    };
  }
}

export default IpInfo;
