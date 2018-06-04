const COUNTRIES = [
  {
    'name': 'United States',
    'dialCode': '+1',
    'code': 'US',
    'flag': '🇺🇸'
  },
  {
    'name': 'Afghanistan',
    'dialCode': '+93',
    'code': 'AF',
    'flag': '🇦🇫'
  },
  {
    'name': 'Åland Islands',
    'dialCode': '+358',
    'code': 'AX',
    'flag': '🇦🇽'
  },
  {
    'name': 'Albania',
    'dialCode': '+355',
    'code': 'AL',
    'flag': '🇦🇱'
  },
  {
    'name': 'Algeria',
    'dialCode': '+213',
    'code': 'DZ',
    'flag': '🇩🇿'
  },
  {
    'name': 'American Samoa',
    'dialCode': '+1684',
    'code': 'AS',
    'flag': '🇺🇸'
  },
  {
    'name': 'Andorra',
    'dialCode': '+376',
    'code': 'AD',
    'flag': '🇦🇩'
  },
  {
    'name': 'Angola',
    'dialCode': '+244',
    'code': 'AO',
    'flag': '🇦🇴'
  },
  {
    'name': 'Anguilla',
    'dialCode': '+1264',
    'code': 'AI',
    'flag': '🇦🇮'
  },
  {
    'name': 'Antarctica',
    'dialCode': '+672',
    'code': 'AQ',
    'flag': '🇦🇶'
  },
  {
    'name': 'Antigua and Barbuda',
    'dialCode': '+1268',
    'code': 'AG',
    'flag': '🇦🇬'
  },
  {
    'name': 'Argentina',
    'dialCode': '+54',
    'code': 'AR',
    'flag': '🇦🇷'
  },
  {
    'name': 'Armenia',
    'dialCode': '+374',
    'code': 'AM',
    'flag': '🇦🇲'
  },
  {
    'name': 'Aruba',
    'dialCode': '+297',
    'code': 'AW',
    'flag': '🇦🇼'
  },
  {
    'name': 'Australia',
    'dialCode': '+61',
    'code': 'AU',
    'flag': '🇦🇺'
  },
  {
    'name': 'Austria',
    'dialCode': '+43',
    'code': 'AT',
    'flag': '🇦🇹'
  },
  {
    'name': 'Azerbaijan',
    'dialCode': '+994',
    'code': 'AZ',
    'flag': '🇦🇿'
  },
  {
    'name': 'Bahamas',
    'dialCode': '+1242',
    'code': 'BS',
    'flag': '🇧🇸'
  },
  {
    'name': 'Bahrain',
    'dialCode': '+973',
    'code': 'BH',
    'flag': '🇧🇸'
  },
  {
    'name': 'Bangladesh',
    'dialCode': '+880',
    'code': 'BD',
    'flag': '🇧🇩'
  },
  {
    'name': 'Barbados',
    'dialCode': '+1246',
    'code': 'BB',
    'flag': '🇧🇧'
  },
  {
    'name': 'Belarus',
    'dialCode': '+375',
    'code': 'BY',
    'flag': '🇧🇾'
  },
  {
    'name': 'Belgium',
    'dialCode': '+32',
    'code': 'BE',
    'flag': '🇧🇪'
  },
  {
    'name': 'Belize',
    'dialCode': '+501',
    'code': 'BZ',
    'flag': '🇧🇿'
  },
  {
    'name': 'Benin',
    'dialCode': '+229',
    'code': 'BJ',
    'flag': '🇧🇯'
  },
  {
    'name': 'Bermuda',
    'dialCode': '+1441',
    'code': 'BM',
    'flag': '🇧🇲'
  },
  {
    'name': 'Bhutan',
    'dialCode': '+975',
    'code': 'BT',
    'flag': '🇧🇹'
  },
  {
    'name': 'Bolivia, Plurinational State of bolivia',
    'dialCode': '+591',
    'code': 'BO',
    'flag': '🇧🇴'
  },
  {
    'name': 'Bosnia and Herzegovina',
    'dialCode': '+387',
    'code': 'BA',
    'flag': '🇧🇦'
  },
  {
    'name': 'Botswana',
    'dialCode': '+267',
    'code': 'BW',
    'flag': '🇧🇼'
  },
  {
    'name': 'Bouvet Island',
    'dialCode': '+47',
    'code': 'BV',
    'flag': '🏳'
  },
  {
    'name': 'Brazil',
    'dialCode': '+55',
    'code': 'BR',
    'flag': '🇧🇷'
  },
  {
    'name': 'British Indian Ocean Territory',
    'dialCode': '+246',
    'code': 'IO',
    'flag': '🇮🇴'
  },
  {
    'name': 'Brunei Darussalam',
    'dialCode': '+673',
    'code': 'BN',
    'flag': '🇧🇳'
  },
  {
    'name': 'Bulgaria',
    'dialCode': '+359',
    'code': 'BG',
    'flag': '🇧🇬'
  },
  {
    'name': 'Burkina Faso',
    'dialCode': '+226',
    'code': 'BF',
    'flag': '🇧🇫'
  },
  {
    'name': 'Burundi',
    'dialCode': '+257',
    'code': 'BI',
    'flag': '🇧🇮'
  },
  {
    'name': 'Cambodia',
    'dialCode': '+855',
    'code': 'KH',
    'flag': '🇰🇭'
  },
  {
    'name': 'Cameroon',
    'dialCode': '+237',
    'code': 'CM',
    'flag': '🇨🇲'
  },
  {
    'name': 'Canada',
    'dialCode': '+1',
    'code': 'CA',
    'flag': '🇨🇦'
  },
  {
    'name': 'Cape Verde',
    'dialCode': '+238',
    'code': 'CV',
    'flag': '🇨🇻'
  },
  {
    'name': 'Cayman Islands',
    'dialCode': '+ 345',
    'code': 'KY',
    'flag': '🇰🇾'
  },
  {
    'name': 'Central African Republic',
    'dialCode': '+236',
    'code': 'CF',
    'flag': '🇨🇫'
  },
  {
    'name': 'Chad',
    'dialCode': '+235',
    'code': 'TD',
    'flag': '🇹🇩'
  },
  {
    'name': 'Chile',
    'dialCode': '+56',
    'code': 'CL',
    'flag': '🇨🇱'
  },
  {
    'name': 'China',
    'dialCode': '+86',
    'code': 'CN',
    'flag': '🇨🇳'
  },
  {
    'name': 'Christmas Island',
    'dialCode': '+61',
    'code': 'CX',
    'flag': '🇨🇽'
  },
  {
    'name': 'Cocos (Keeling) Islands',
    'dialCode': '+61',
    'code': 'CC',
    'flag': '🇨🇨'
  },
  {
    'name': 'Colombia',
    'dialCode': '+57',
    'code': 'CO',
    'flag': '🇨🇴'
  },
  {
    'name': 'Comoros',
    'dialCode': '+269',
    'code': 'KM',
    'flag': '🇰🇲'
  },
  {
    'name': 'Congo',
    'dialCode': '+242',
    'code': 'CG',
    'flag': '🇨🇬'
  },
  {
    'name': 'Congo, The Democratic Republic of the Congo',
    'dialCode': '+243',
    'code': 'CD',
    'flag': '🇨🇩'
  },
  {
    'name': 'Cook Islands',
    'dialCode': '+682',
    'code': 'CK',
    'flag': '🇨🇰'
  },
  {
    'name': 'Costa Rica',
    'dialCode': '+506',
    'code': 'CR',
    'flag': '🇨🇷'
  },
  {
    'name': 'Cote d\'Ivoire',
    'dialCode': '+225',
    'code': 'CI',
    'flag': '🇨🇮'
  },
  {
    'name': 'Croatia',
    'dialCode': '+385',
    'code': 'HR',
    'flag': '🇭🇷'
  },
  {
    'name': 'Cuba',
    'dialCode': '+53',
    'code': 'CU',
    'flag': '🇨🇺'
  },
  {
    'name': 'Cyprus',
    'dialCode': '+357',
    'code': 'CY',
    'flag': '🇨🇾'
  },
  {
    'name': 'Czech Republic',
    'dialCode': '+420',
    'code': 'CZ',
    'flag': '🇨🇿'
  },
  {
    'name': 'Denmark',
    'dialCode': '+45',
    'code': 'DK',
    'flag': '🇩🇰'
  },
  {
    'name': 'Djibouti',
    'dialCode': '+253',
    'code': 'DJ',
    'flag': '🇩🇯'
  },
  {
    'name': 'Dominica',
    'dialCode': '+1767',
    'code': 'DM',
    'flag': '🇩🇲'
  },
  {
    'name': 'Dominican Republic',
    'dialCode': '+1849',
    'code': 'DO',
    'flag': '🇨🇩'
  },
  {
    'name': 'Ecuador',
    'dialCode': '+593',
    'code': 'EC',
    'flag': '🇪🇨'
  },
  {
    'name': 'Egypt',
    'dialCode': '+20',
    'code': 'EG',
    'flag': '🇪🇬'
  },
  {
    'name': 'El Salvador',
    'dialCode': '+503',
    'code': 'SV',
    'flag': '🇸🇻'
  },
  {
    'name': 'Equatorial Guinea',
    'dialCode': '+240',
    'code': 'GQ',
    'flag': '🇬🇶'
  },
  {
    'name': 'Eritrea',
    'dialCode': '+291',
    'code': 'ER',
    'flag': '🇪🇷'
  },
  {
    'name': 'Estonia',
    'dialCode': '+372',
    'code': 'EE',
    'flag': '🇪🇪'
  },
  {
    'name': 'Ethiopia',
    'dialCode': '+251',
    'code': 'ET',
    'flag': '🇪🇹'
  },
  {
    'name': 'Falkland Islands (Malvinas)',
    'dialCode': '+500',
    'code': 'FK',
    'flag': '🇫🇰'
  },
  {
    'name': 'Faroe Islands',
    'dialCode': '+298',
    'code': 'FO',
    'flag': '🇫🇴'
  },
  {
    'name': 'Fiji',
    'dialCode': '+679',
    'code': 'FJ',
    'flag': '🇫🇯'
  },
  {
    'name': 'Finland',
    'dialCode': '+358',
    'code': 'FI',
    'flag': '🇫🇮'
  },
  {
    'name': 'France',
    'dialCode': '+33',
    'code': 'FR',
    'flag': '🇫🇷'
  },
  {
    'name': 'French Guiana',
    'dialCode': '+594',
    'code': 'GF',
    'flag': '🇬🇫'
  },
  {
    'name': 'French Polynesia',
    'dialCode': '+689',
    'code': 'PF',
    'flag': '🇵🇫'
  },
  {
    'name': 'French Southern Territories',
    'dialCode': '+262',
    'code': 'TF',
    'flag': '🇹🇫'
  },
  {
    'name': 'Gabon',
    'dialCode': '+241',
    'code': 'GA',
    'flag': '🇬🇦'
  },
  {
    'name': 'Gambia',
    'dialCode': '+220',
    'code': 'GM',
    'flag': '🇬🇲'
  },
  {
    'name': 'Georgia',
    'dialCode': '+995',
    'code': 'GE',
    'flag': '🇬🇪'
  },
  {
    'name': 'Germany',
    'dialCode': '+49',
    'code': 'DE',
    'flag': '🇩🇪'
  },
  {
    'name': 'Ghana',
    'dialCode': '+233',
    'code': 'GH',
    'flag': '🇬🇭'
  },
  {
    'name': 'Gibraltar',
    'dialCode': '+350',
    'code': 'GI',
    'flag': '🇬🇮'
  },
  {
    'name': 'Greece',
    'dialCode': '+30',
    'code': 'GR',
    'flag': '🇬🇷'
  },
  {
    'name': 'Greenland',
    'dialCode': '+299',
    'code': 'GL',
    'flag': '🇬🇱'
  },
  {
    'name': 'Grenada',
    'dialCode': '+1473',
    'code': 'GD',
    'flag': '🇬🇩'
  },
  {
    'name': 'Guadeloupe',
    'dialCode': '+590',
    'code': 'GP',
    'flag': '🇬🇵'
  },
  {
    'name': 'Guam',
    'dialCode': '+1671',
    'code': 'GU',
    'flag': '🇬🇺'
  },
  {
    'name': 'Guatemala',
    'dialCode': '+502',
    'code': 'GT',
    'flag': '🇬🇹'
  },
  {
    'name': 'Guernsey',
    'dialCode': '+44',
    'code': 'GG',
    'flag': '🇬🇬'
  },
  {
    'name': 'Guinea',
    'dialCode': '+224',
    'code': 'GN',
    'flag': '🇬🇳'
  },
  {
    'name': 'Guinea-Bissau',
    'dialCode': '+245',
    'code': 'GW',
    'flag': '🇬🇼'
  },
  {
    'name': 'Guyana',
    'dialCode': '+592',
    'code': 'GY',
    'flag': '🇬🇾'
  },
  {
    'name': 'Haiti',
    'dialCode': '+509',
    'code': 'HT',
    'flag': '🇭🇹'
  },
  {
    'name': 'Heard Island and Mcdonald Islands',
    'dialCode': '+0',
    'code': 'HM',
    'flag': '🏳'
  },
  {
    'name': 'Holy See (Vatican City State)',
    'dialCode': '+379',
    'code': 'VA',
    'flag': '🇻🇦'
  },
  {
    'name': 'Honduras',
    'dialCode': '+504',
    'code': 'HN',
    'flag': '🇭🇳'
  },
  {
    'name': 'Hong Kong',
    'dialCode': '+852',
    'code': 'HK',
    'flag': '🇭🇰'
  },
  {
    'name': 'Hungary',
    'dialCode': '+36',
    'code': 'HU',
    'flag': '🇭🇺'
  },
  {
    'name': 'Iceland',
    'dialCode': '+354',
    'code': 'IS',
    'flag': '🇮🇸'
  },
  {
    'name': 'India',
    'dialCode': '+91',
    'code': 'IN',
    'flag': '🇮🇳'
  },
  {
    'name': 'Indonesia',
    'dialCode': '+62',
    'code': 'ID',
    'flag': '🇮🇩'
  },
  {
    'name': 'Iran, Islamic Republic of Persian Gulf',
    'dialCode': '+98',
    'code': 'IR',
    'flag': '🇮🇷'
  },
  {
    'name': 'Iraq',
    'dialCode': '+964',
    'code': 'IQ',
    'flag': '🇮🇶'
  },
  {
    'name': 'Ireland',
    'dialCode': '+353',
    'code': 'IE',
    'flag': '🇮🇪'
  },
  {
    'name': 'Isle of Man',
    'dialCode': '+44',
    'code': 'IM',
    'flag': '🇮🇲'
  },
  {
    'name': 'Israel',
    'dialCode': '+972',
    'code': 'IL',
    'flag': '🇮🇱'
  },
  {
    'name': 'Italy',
    'dialCode': '+39',
    'code': 'IT',
    'flag': '🇮🇹'
  },
  {
    'name': 'Jamaica',
    'dialCode': '+1876',
    'code': 'JM',
    'flag': '🇯🇲'
  },
  {
    'name': 'Japan',
    'dialCode': '+81',
    'code': 'JP',
    'flag': '🇯🇵'
  },
  {
    'name': 'Jersey',
    'dialCode': '+44',
    'code': 'JE',
    'flag': '🇯🇪'
  },
  {
    'name': 'Jordan',
    'dialCode': '+962',
    'code': 'JO',
    'flag': '🇯🇴'
  },
  {
    'name': 'Kazakhstan',
    'dialCode': '+7',
    'code': 'KZ',
    'flag': '🇰🇿'
  },
  {
    'name': 'Kenya',
    'dialCode': '+254',
    'code': 'KE',
    'flag': '🇰🇪'
  },
  {
    'name': 'Kiribati',
    'dialCode': '+686',
    'code': 'KI',
    'flag': '🇰🇮'
  },
  {
    'name': 'Korea, Democratic People\'s Republic of Korea',
    'dialCode': '+850',
    'code': 'KP',
    'flag': '🇰🇵'
  },
  {
    'name': 'Korea, Republic of South Korea',
    'dialCode': '+82',
    'code': 'KR',
    'flag': '🇰🇷'
  },
  {
    'name': 'Kosovo',
    'dialCode': '+383',
    'code': 'XK',
    'flag': '🇽🇰'
  },
  {
    'name': 'Kuwait',
    'dialCode': '+965',
    'code': 'KW',
    'flag': '🇰🇼'
  },
  {
    'name': 'Kyrgyzstan',
    'dialCode': '+996',
    'code': 'KG',
    'flag': '🇰🇬'
  },
  {
    'name': 'Laos',
    'dialCode': '+856',
    'code': 'LA',
    'flag': '🇱🇦'
  },
  {
    'name': 'Latvia',
    'dialCode': '+371',
    'code': 'LV',
    'flag': '🇱🇻'
  },
  {
    'name': 'Lebanon',
    'dialCode': '+961',
    'code': 'LB',
    'flag': '🇱🇧'
  },
  {
    'name': 'Lesotho',
    'dialCode': '+266',
    'code': 'LS',
    'flag': '🇱🇸'
  },
  {
    'name': 'Liberia',
    'dialCode': '+231',
    'code': 'LR',
    'flag': '🇱🇷'
  },
  {
    'name': 'Libyan Arab Jamahiriya',
    'dialCode': '+218',
    'code': 'LY',
    'flag': '🇱🇾'
  },
  {
    'name': 'Liechtenstein',
    'dialCode': '+423',
    'code': 'LI',
    'flag': '🇱🇮'
  },
  {
    'name': 'Lithuania',
    'dialCode': '+370',
    'code': 'LT',
    'flag': '🇱🇹'
  },
  {
    'name': 'Luxembourg',
    'dialCode': '+352',
    'code': 'LU',
    'flag': '🇱🇺'
  },
  {
    'name': 'Macao',
    'dialCode': '+853',
    'code': 'MO',
    'flag': '🇲🇴'
  },
  {
    'name': 'Macedonia',
    'dialCode': '+389',
    'code': 'MK',
    'flag': '🇲🇰'
  },
  {
    'name': 'Madagascar',
    'dialCode': '+261',
    'code': 'MG',
    'flag': '🇲🇬'
  },
  {
    'name': 'Malawi',
    'dialCode': '+265',
    'code': 'MW',
    'flag': '🇲🇼'
  },
  {
    'name': 'Malaysia',
    'dialCode': '+60',
    'code': 'MY',
    'flag': '🇲🇾'
  },
  {
    'name': 'Maldives',
    'dialCode': '+960',
    'code': 'MV',
    'flag': '🇲🇻'
  },
  {
    'name': 'Mali',
    'dialCode': '+223',
    'code': 'ML',
    'flag': '🇲🇱'
  },
  {
    'name': 'Malta',
    'dialCode': '+356',
    'code': 'MT',
    'flag': '🇲🇹'
  },
  {
    'name': 'Marshall Islands',
    'dialCode': '+692',
    'code': 'MH',
    'flag': '🇲🇭'
  },
  {
    'name': 'Martinique',
    'dialCode': '+596',
    'code': 'MQ',
    'flag': '🇲🇶'
  },
  {
    'name': 'Mauritania',
    'dialCode': '+222',
    'code': 'MR',
    'flag': '🇲🇷'
  },
  {
    'name': 'Mauritius',
    'dialCode': '+230',
    'code': 'MU',
    'flag': '🇲🇺'
  },
  {
    'name': 'Mayotte',
    'dialCode': '+262',
    'code': 'YT',
    'flag': '🇾🇹'
  },
  {
    'name': 'Mexico',
    'dialCode': '+52',
    'code': 'MX',
    'flag': '🇲🇽'
  },
  {
    'name': 'Micronesia, Federated States of Micronesia',
    'dialCode': '+691',
    'code': 'FM',
    'flag': '🇫🇲'
  },
  {
    'name': 'Moldova',
    'dialCode': '+373',
    'code': 'MD',
    'flag': '🇲🇩'
  },
  {
    'name': 'Monaco',
    'dialCode': '+377',
    'code': 'MC',
    'flag': '🇲🇨'
  },
  {
    'name': 'Mongolia',
    'dialCode': '+976',
    'code': 'MN',
    'flag': '🇲🇳'
  },
  {
    'name': 'Montenegro',
    'dialCode': '+382',
    'code': 'ME',
    'flag': '🇲🇪'
  },
  {
    'name': 'Montserrat',
    'dialCode': '+1664',
    'code': 'MS',
    'flag': '🇲🇸'
  },
  {
    'name': 'Morocco',
    'dialCode': '+212',
    'code': 'MA',
    'flag': '🇲🇦'
  },
  {
    'name': 'Mozambique',
    'dialCode': '+258',
    'code': 'MZ',
    'flag': '🇲🇿'
  },
  {
    'name': 'Myanmar',
    'dialCode': '+95',
    'code': 'MM',
    'flag': '🇲🇲'
  },
  {
    'name': 'Namibia',
    'dialCode': '+264',
    'code': 'NA',
    'flag': '🇳🇦'
  },
  {
    'name': 'Nauru',
    'dialCode': '+674',
    'code': 'NR',
    'flag': '🇳🇷'
  },
  {
    'name': 'Nepal',
    'dialCode': '+977',
    'code': 'NP',
    'flag': '🇳🇵'
  },
  {
    'name': 'Netherlands',
    'dialCode': '+31',
    'code': 'NL',
    'flag': '🇳🇱'
  },
  {
    'name': 'Netherlands Antilles',
    'dialCode': '+599',
    'code': 'AN',
    'flag': '🇳🇱'
  },
  {
    'name': 'New Caledonia',
    'dialCode': '+687',
    'code': 'NC',
    'flag': '🇳🇨'
  },
  {
    'name': 'New Zealand',
    'dialCode': '+64',
    'code': 'NZ',
    'flag': '🇳🇿'
  },
  {
    'name': 'Nicaragua',
    'dialCode': '+505',
    'code': 'NI',
    'flag': '🇳🇮'
  },
  {
    'name': 'Niger',
    'dialCode': '+227',
    'code': 'NE',
    'flag': '🇳🇪'
  },
  {
    'name': 'Nigeria',
    'dialCode': '+234',
    'code': 'NG',
    'flag': '🇳🇬'
  },
  {
    'name': 'Niue',
    'dialCode': '+683',
    'code': 'NU',
    'flag': '🇳🇺'
  },
  {
    'name': 'Norfolk Island',
    'dialCode': '+672',
    'code': 'NF',
    'flag': '🇳🇫'
  },
  {
    'name': 'Northern Mariana Islands',
    'dialCode': '+1670',
    'code': 'MP',
    'flag': '🏳'
  },
  {
    'name': 'Norway',
    'dialCode': '+47',
    'code': 'NO',
    'flag': '🇳🇴'
  },
  {
    'name': 'Oman',
    'dialCode': '+968',
    'code': 'OM',
    'flag': '🇴🇲'
  },
  {
    'name': 'Pakistan',
    'dialCode': '+92',
    'code': 'PK',
    'flag': '🇵🇰'
  },
  {
    'name': 'Palau',
    'dialCode': '+680',
    'code': 'PW',
    'flag': '🇵🇼'
  },
  {
    'name': 'Palestinian Territory, Occupied',
    'dialCode': '+970',
    'code': 'PS',
    'flag': '🇵🇸'
  },
  {
    'name': 'Panama',
    'dialCode': '+507',
    'code': 'PA',
    'flag': '🇵🇦'
  },
  {
    'name': 'Papua New Guinea',
    'dialCode': '+675',
    'code': 'PG',
    'flag': '🇵🇬'
  },
  {
    'name': 'Paraguay',
    'dialCode': '+595',
    'code': 'PY',
    'flag': '🇵🇾'
  },
  {
    'name': 'Peru',
    'dialCode': '+51',
    'code': 'PE',
    'flag': '🇵🇪'
  },
  {
    'name': 'Philippines',
    'dialCode': '+63',
    'code': 'PH',
    'flag': '🇵🇭'
  },
  {
    'name': 'Pitcairn',
    'dialCode': '+64',
    'code': 'PN',
    'flag': '🇵🇳'
  },
  {
    'name': 'Poland',
    'dialCode': '+48',
    'code': 'PL',
    'flag': '🇵🇱'
  },
  {
    'name': 'Portugal',
    'dialCode': '+351',
    'code': 'PT',
    'flag': '🇵🇹'
  },
  {
    'name': 'Puerto Rico',
    'dialCode': '+1939',
    'code': 'PR',
    'flag': '🇵🇷'
  },
  {
    'name': 'Qatar',
    'dialCode': '+974',
    'code': 'QA',
    'flag': '🇶🇦'
  },
  {
    'name': 'Romania',
    'dialCode': '+40',
    'code': 'RO',
    'flag': '🇷🇴'
  },
  {
    'name': 'Russia',
    'dialCode': '+7',
    'code': 'RU',
    'flag': '🇷🇺'
  },
  {
    'name': 'Rwanda',
    'dialCode': '+250',
    'code': 'RW',
    'flag': '🇷🇼'
  },
  {
    'name': 'Reunion',
    'dialCode': '+262',
    'code': 'RE',
    'flag': '🇫🇷'
  },
  {
    'name': 'Saint Barthelemy',
    'dialCode': '+590',
    'code': 'BL',
    'flag': '🇧🇱'
  },
  {
    'name': 'Saint Helena, Ascension and Tristan Da Cunha',
    'dialCode': '+290',
    'code': 'SH',
    'flag': '🇸🇭'
  },
  {
    'name': 'Saint Kitts and Nevis',
    'dialCode': '+1869',
    'code': 'KN',
    'flag': '🇰🇳'
  },
  {
    'name': 'Saint Lucia',
    'dialCode': '+1758',
    'code': 'LC',
    'flag': '🇱🇨'
  },
  {
    'name': 'Saint Martin',
    'dialCode': '+590',
    'code': 'MF',
    'flag': '🏳'
  },
  {
    'name': 'Saint Pierre and Miquelon',
    'dialCode': '+508',
    'code': 'PM',
    'flag': '🇵🇲'
  },
  {
    'name': 'Saint Vincent and the Grenadines',
    'dialCode': '+1784',
    'code': 'VC',
    'flag': '🇻🇨'
  },
  {
    'name': 'Samoa',
    'dialCode': '+685',
    'code': 'WS',
    'flag': '🇼🇸'
  },
  {
    'name': 'San Marino',
    'dialCode': '+378',
    'code': 'SM',
    'flag': '🇸🇲'
  },
  {
    'name': 'Sao Tome and Principe',
    'dialCode': '+239',
    'code': 'ST',
    'flag': '🇸🇹'
  },
  {
    'name': 'Saudi Arabia',
    'dialCode': '+966',
    'code': 'SA',
    'flag': '🇸🇦'
  },
  {
    'name': 'Senegal',
    'dialCode': '+221',
    'code': 'SN',
    'flag': '🇸🇳'
  },
  {
    'name': 'Serbia',
    'dialCode': '+381',
    'code': 'RS',
    'flag': '🇷🇸'
  },
  {
    'name': 'Seychelles',
    'dialCode': '+248',
    'code': 'SC',
    'flag': '🇸🇨'
  },
  {
    'name': 'Sierra Leone',
    'dialCode': '+232',
    'code': 'SL',
    'flag': '🇸🇱'
  },
  {
    'name': 'Singapore',
    'dialCode': '+65',
    'code': 'SG',
    'flag': '🇸🇬'
  },
  {
    'name': 'Slovakia',
    'dialCode': '+421',
    'code': 'SK',
    'flag': '🇸🇰'
  },
  {
    'name': 'Slovenia',
    'dialCode': '+386',
    'code': 'SI',
    'flag': '🇸🇮'
  },
  {
    'name': 'Solomon Islands',
    'dialCode': '+677',
    'code': 'SB',
    'flag': '🇸🇧'
  },
  {
    'name': 'Somalia',
    'dialCode': '+252',
    'code': 'SO',
    'flag': '🇸🇴'
  },
  {
    'name': 'South Africa',
    'dialCode': '+27',
    'code': 'ZA',
    'flag': '🇿🇦'
  },
  {
    'name': 'South Sudan',
    'dialCode': '+211',
    'code': 'SS',
    'flag': '🇸🇸'
  },
  {
    'name': 'South Georgia and the South Sandwich Islands',
    'dialCode': '+500',
    'code': 'GS',
    'flag': '🇬🇸'
  },
  {
    'name': 'Spain',
    'dialCode': '+34',
    'code': 'ES',
    'flag': '🇪🇸'
  },
  {
    'name': 'Sri Lanka',
    'dialCode': '+94',
    'code': 'LK',
    'flag': '🇱🇰'
  },
  {
    'name': 'Sudan',
    'dialCode': '+249',
    'code': 'SD',
    'flag': '🇸🇩'
  },
  {
    'name': 'Suriname',
    'dialCode': '+597',
    'code': 'SR',
    'flag': '🇸🇷'
  },
  {
    'name': 'Svalbard and Jan Mayen',
    'dialCode': '+47',
    'code': 'SJ',
    'flag': '🇩🇰'
  },
  {
    'name': 'Swaziland',
    'dialCode': '+268',
    'code': 'SZ',
    'flag': '🇸🇿'
  },
  {
    'name': 'Sweden',
    'dialCode': '+46',
    'code': 'SE',
    'flag': '🇸🇪'
  },
  {
    'name': 'Switzerland',
    'dialCode': '+41',
    'code': 'CH',
    'flag': '🇨🇭'
  },
  {
    'name': 'Syrian Arab Republic',
    'dialCode': '+963',
    'code': 'SY',
    'flag': '🇸🇾'
  },
  {
    'name': 'Taiwan',
    'dialCode': '+886',
    'code': 'TW',
    'flag': '🇹🇼'
  },
  {
    'name': 'Tajikistan',
    'dialCode': '+992',
    'code': 'TJ',
    'flag': '🇹🇯'
  },
  {
    'name': 'Tanzania, United Republic of Tanzania',
    'dialCode': '+255',
    'code': 'TZ',
    'flag': '🇹🇿'
  },
  {
    'name': 'Thailand',
    'dialCode': '+66',
    'code': 'TH',
    'flag': '🇹🇭'
  },
  {
    'name': 'Timor-Leste',
    'dialCode': '+670',
    'code': 'TL',
    'flag': '🇹🇱'
  },
  {
    'name': 'Togo',
    'dialCode': '+228',
    'code': 'TG',
    'flag': '🇹🇬'
  },
  {
    'name': 'Tokelau',
    'dialCode': '+690',
    'code': 'TK',
    'flag': '🇹🇰'
  },
  {
    'name': 'Tonga',
    'dialCode': '+676',
    'code': 'TO',
    'flag': '🇹🇴'
  },
  {
    'name': 'Trinidad and Tobago',
    'dialCode': '+1868',
    'code': 'TT',
    'flag': '🇹🇹'
  },
  {
    'name': 'Tunisia',
    'dialCode': '+216',
    'code': 'TN',
    'flag': '🇹🇳'
  },
  {
    'name': 'Turkey',
    'dialCode': '+90',
    'code': 'TR',
    'flag': '🇹🇷'
  },
  {
    'name': 'Turkmenistan',
    'dialCode': '+993',
    'code': 'TM',
    'flag': '🇹🇲'
  },
  {
    'name': 'Turks and Caicos Islands',
    'dialCode': '+1649',
    'code': 'TC',
    'flag': '🇹🇨'
  },
  {
    'name': 'Tuvalu',
    'dialCode': '+688',
    'code': 'TV',
    'flag': '🇹🇻'
  },
  {
    'name': 'Uganda',
    'dialCode': '+256',
    'code': 'UG',
    'flag': '🇺🇬'
  },
  {
    'name': 'Ukraine',
    'dialCode': '+380',
    'code': 'UA',
    'flag': '🇺🇦'
  },
  {
    'name': 'United Arab Emirates',
    'dialCode': '+971',
    'code': 'AE',
    'flag': '🇦🇪'
  },
  {
    'name': 'United Kingdom',
    'dialCode': '+44',
    'code': 'GB',
    'flag': '🇬🇧'
  },
  {
    'name': 'Uruguay',
    'dialCode': '+598',
    'code': 'UY',
    'flag': '🇺🇾'
  },
  {
    'name': 'Uzbekistan',
    'dialCode': '+998',
    'code': 'UZ',
    'flag': '🇺🇿'
  },
  {
    'name': 'Vanuatu',
    'dialCode': '+678',
    'code': 'VU',
    'flag': '🇻🇺'
  },
  {
    'name': 'Venezuela, Bolivarian Republic of Venezuela',
    'dialCode': '+58',
    'code': 'VE',
    'flag': '🇻🇪'
  },
  {
    'name': 'Vietnam',
    'dialCode': '+84',
    'code': 'VN',
    'flag': '🇻🇳'
  },
  {
    'name': 'Virgin Islands, British',
    'dialCode': '+1284',
    'code': 'VG',
    'flag': '🇻🇬'
  },
  {
    'name': 'Virgin Islands, U.S.',
    'dialCode': '+1340',
    'code': 'VI',
    'flag': '🇻🇮'
  },
  {
    'name': 'Wallis and Futuna',
    'dialCode': '+681',
    'code': 'WF',
    'flag': '🇼🇫'
  },
  {
    'name': 'Yemen',
    'dialCode': '+967',
    'code': 'YE',
    'flag': '🇾🇪'
  },
  {
    'name': 'Zambia',
    'dialCode': '+260',
    'code': 'ZM',
    'flag': '🇿🇲'
  },
  {
    'name': 'Zimbabwe',
    'dialCode': '+263',
    'code': 'ZW',
    'flag': '🇿🇼'
  }
]

export default COUNTRIES;
