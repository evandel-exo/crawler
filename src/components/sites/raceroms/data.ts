// Content extracted from https://raceroms.com/ (SSR payload + rendered DOM). Generated; edit freely.
export type Brand = { title: string; href: string; logo: string; isNew: boolean };
export type VehicleType = { slug: string; title: string; brands: Brand[] };
export type Equipment = { title: string; href: string; image: string };
export type Review = { text: string; author: string };
export type Faq = { question: string; answer: string };
export type Store = { title: string; openTimes: string; email: string; location: string; phones: string[] };

export const vehicleTypes: VehicleType[] = [
  {
    "slug": "car",
    "title": "Αυτοκίνητα",
    "brands": [
      {
        "title": "Alfa Romeo",
        "href": "https://raceroms.com/car/alfa-romeo",
        "logo": "/sites/raceroms/brands/262-SM0tgvZy0Fa4K8wRSqE7KN1cdde6TxZTVCa55etw.svg",
        "isNew": false
      },
      {
        "title": "Alpina",
        "href": "https://raceroms.com/car/alpina",
        "logo": "/sites/raceroms/brands/101-F9NhSWWBuHjyRhxG9hVhI0c4J1TPwiYVw56tY2uN.svg",
        "isNew": false
      },
      {
        "title": "Alpine",
        "href": "https://raceroms.com/car/alpine",
        "logo": "/sites/raceroms/brands/137-N75LUofOybxWaEY6nNPODLXKPblcxe0jZWRQoSIQ.svg",
        "isNew": false
      },
      {
        "title": "Ariel Motors",
        "href": "https://raceroms.com/car/ariel-motors",
        "logo": "/sites/raceroms/brands/83-A64rjpbO9eh6ei4OgVeb5IDrAm8o1SNzyy9NVAb5.svg",
        "isNew": false
      },
      {
        "title": "Artega",
        "href": "https://raceroms.com/car/artega",
        "logo": "/sites/raceroms/brands/5119-01K6JA0JKWQ007TF09M7YFKGXM-logo.png",
        "isNew": false
      },
      {
        "title": "Aston Martin",
        "href": "https://raceroms.com/car/aston-martin",
        "logo": "/sites/raceroms/brands/86-mnXLyOrWStKoWwntqzXJJ8n6URBW9Pp15SrzZLlX-logo.png",
        "isNew": false
      },
      {
        "title": "Audi",
        "href": "https://raceroms.com/car/audi",
        "logo": "/sites/raceroms/brands/92-FjdWimavdZ1oluX6O07952txcfIN9fvi5JqW2rL6.svg",
        "isNew": false
      },
      {
        "title": "Bentley",
        "href": "https://raceroms.com/car/bentley",
        "logo": "/sites/raceroms/brands/259-92FgrqcXkOqqVKh5qS5Qsh9xUfUpbe4cHjQNvokS.svg",
        "isNew": false
      },
      {
        "title": "BMW",
        "href": "https://raceroms.com/car/bmw",
        "logo": "/sites/raceroms/brands/77-uBSQuLItG4sDmpFjiDI800Qco5RmxImUP296vAvI.svg",
        "isNew": false
      },
      {
        "title": "Borgward",
        "href": "https://raceroms.com/car/borgward",
        "logo": "/sites/raceroms/brands/5121-01K6JAAEBR6DXKAB70CC2JB87T-logo.png",
        "isNew": false
      },
      {
        "title": "Bugatti",
        "href": "https://raceroms.com/car/bugatti",
        "logo": "/sites/raceroms/brands/107-ObKXGrsozzXPr0t39XfRBJ7ZgVVSj3Wvi7713Wz1.svg",
        "isNew": false
      },
      {
        "title": "Buick",
        "href": "https://raceroms.com/car/buick",
        "logo": "/sites/raceroms/brands/110-76PAMb2jWAf1LDOhCbj0CNXzIfAyDVjYMbhQuUYS.svg",
        "isNew": false
      },
      {
        "title": "BYD",
        "href": "https://raceroms.com/car/byd",
        "logo": "/sites/raceroms/brands/445-eb12mnhF0iKy61FN9Pj6TXjXpKZuYsOkkmSA0q4D-logo.png",
        "isNew": false
      },
      {
        "title": "Cadillac",
        "href": "https://raceroms.com/car/cadillac",
        "logo": "/sites/raceroms/brands/113-8es40xyN9smCDBy5TVwhoFCOI0h24IIG4aP2b7sY-logo.png",
        "isNew": false
      },
      {
        "title": "Caterham",
        "href": "https://raceroms.com/car/caterham",
        "logo": "/sites/raceroms/brands/5122-01K6JACN1F1GJ6PHDR6421YA2R-logo.png",
        "isNew": false
      },
      {
        "title": "Chevrolet",
        "href": "https://raceroms.com/car/chevrolet",
        "logo": "/sites/raceroms/brands/116-unKhsackQleMhyLZNoiU6Tx7ZRxue7dtKL1lg2yv.svg",
        "isNew": false
      },
      {
        "title": "Chrysler",
        "href": "https://raceroms.com/car/chrysler",
        "logo": "/sites/raceroms/brands/122-ljC19srzb0EpSGLWXF3DvJFfk6IXhTHsLjSKmkpk.svg",
        "isNew": false
      },
      {
        "title": "Citroën",
        "href": "https://raceroms.com/car/citroen",
        "logo": "/sites/raceroms/brands/257-qIKesCsREdhgCwJW5BvFDDw4fNHDRRAvA6o8qeQu-logo.png",
        "isNew": false
      },
      {
        "title": "Cupra",
        "href": "https://raceroms.com/car/cupra",
        "logo": "/sites/raceroms/brands/125-tXxXPLyHxdhqyzjtnPbyWGxjQpPHUCT9zpNS1vme-logo.png",
        "isNew": false
      },
      {
        "title": "Dacia",
        "href": "https://raceroms.com/car/dacia",
        "logo": "/sites/raceroms/brands/128-WTKmp4IpdthQA4n0VAMMQ4dEgQFidBLH9GyO6EHw-logo.png",
        "isNew": false
      },
      {
        "title": "Dodge",
        "href": "https://raceroms.com/car/dodge",
        "logo": "/sites/raceroms/brands/140-QbQa8Exl7SSboykN4W3LsjVvFVhQIZh744mb3ec9-logo.png",
        "isNew": false
      },
      {
        "title": "DS",
        "href": "https://raceroms.com/car/ds",
        "logo": "/sites/raceroms/brands/152-Q1xqCUHHrSEKfNbfCIkxAiJYcbB4AE1Gd9RhUkYE-logo.png",
        "isNew": false
      },
      {
        "title": "Ferrari",
        "href": "https://raceroms.com/car/ferrari",
        "logo": "/sites/raceroms/brands/146-g5FY5HQTsqsI485jNvSOssVhIfHjSrtA72RArUxX-logo.png",
        "isNew": false
      },
      {
        "title": "Fiat",
        "href": "https://raceroms.com/car/fiat",
        "logo": "/sites/raceroms/brands/242-ABRprC1Gl5tqklTzjfVjXL5pcEFHQZnYBGNgmy9b.svg",
        "isNew": false
      },
      {
        "title": "Ford",
        "href": "https://raceroms.com/car/ford",
        "logo": "/sites/raceroms/brands/245-XS56FKudSKUVLaWOaiv96C7drjtRpcQoTlWdRXPh.svg",
        "isNew": false
      },
      {
        "title": "Geely",
        "href": "https://raceroms.com/car/geely",
        "logo": "/sites/raceroms/brands/5123-01K6JADJNYQ9N8A0DGW6YC2H6R-logo.png",
        "isNew": false
      },
      {
        "title": "GWM",
        "href": "https://raceroms.com/car/gwm",
        "logo": "/sites/raceroms/brands/5124-01K6JAE896MS5756C2TAEBYQTC-logo.png",
        "isNew": false
      },
      {
        "title": "Holden",
        "href": "https://raceroms.com/car/holden",
        "logo": "/sites/raceroms/brands/5125-01K6JAFMXZFCX935077Y95BW38-logo.png",
        "isNew": false
      },
      {
        "title": "Honda",
        "href": "https://raceroms.com/car/honda",
        "logo": "/sites/raceroms/brands/239-m0E48eBAB7Cs4KK1nnrKfAIV7MS9MUr1RC2MH9hw.svg",
        "isNew": false
      },
      {
        "title": "Hyundai",
        "href": "https://raceroms.com/car/hyundai",
        "logo": "/sites/raceroms/brands/236-V3DGVdNHBpqlDutf10gyHttKnHuKQ0tSBU8peiWA-logo.png",
        "isNew": false
      },
      {
        "title": "Ineos",
        "href": "https://raceroms.com/car/ineos",
        "logo": "/sites/raceroms/brands/5126-01K6JAGGK9J1MKSPFRGA88JG48-logo.png",
        "isNew": false
      },
      {
        "title": "Infiniti",
        "href": "https://raceroms.com/car/infiniti",
        "logo": "/sites/raceroms/brands/233-Uu6nBMkIEmiWFESAGyDfQ6rR3hvrRDEGnK65KZ8C-logo.png",
        "isNew": false
      },
      {
        "title": "Isuzu",
        "href": "https://raceroms.com/car/isuzu",
        "logo": "/sites/raceroms/brands/230-yb0vFOZYxrzc0sy6Vl4XFZZy8bSpniZVZK6J9rXU.svg",
        "isNew": false
      },
      {
        "title": "Iveco",
        "href": "https://raceroms.com/car/iveco",
        "logo": "/sites/raceroms/brands/227-hXgzjp38ykL4vCTFF4mWoYvlhgBjDKqzIzQLrcn6-logo.png",
        "isNew": false
      },
      {
        "title": "Jac",
        "href": "https://raceroms.com/car/jac",
        "logo": "/sites/raceroms/brands/5127-01K6JAH1ABA0B4RR2CB54VW68K-logo.png",
        "isNew": false
      },
      {
        "title": "Jaguar",
        "href": "https://raceroms.com/car/jaguar",
        "logo": "/sites/raceroms/brands/224-lbTgfZxL1wEhQqb8I9ZkzCNREwcIHZkZYm7Da0Oo-logo.png",
        "isNew": false
      },
      {
        "title": "Jeep",
        "href": "https://raceroms.com/car/jeep",
        "logo": "/sites/raceroms/brands/221-PymoWQtMaI1phEZltVu850roX8fglt81sDZv6rsQ-logo.png",
        "isNew": false
      },
      {
        "title": "Kia",
        "href": "https://raceroms.com/car/kia",
        "logo": "/sites/raceroms/brands/218-eZRQOgHESLqqTTWA2D6GqaXfj0Pt89aH06aTBAiB-logo.png",
        "isNew": false
      },
      {
        "title": "KTM",
        "href": "https://raceroms.com/car/ktm",
        "logo": "/sites/raceroms/brands/215-ZZaGFMVYcbyCIRaJ5LLEx0cn1SPhvPFU5D8CuGzR.svg",
        "isNew": false
      },
      {
        "title": "Lamborghini",
        "href": "https://raceroms.com/car/lamborghini",
        "logo": "/sites/raceroms/brands/212-FxnpX2hKfMrDBibPlxUDkw4JJz7MUhpA1gEk1fyb-logo.png",
        "isNew": false
      },
      {
        "title": "Lancia",
        "href": "https://raceroms.com/car/lancia",
        "logo": "/sites/raceroms/brands/209-QHHIwQ4MgcGsmbJIeTjhCI7OqzXHPcdT6G7jZuqo.svg",
        "isNew": false
      },
      {
        "title": "Landrover",
        "href": "https://raceroms.com/car/landrover",
        "logo": "/sites/raceroms/brands/206-ocWcINhiPZEqqSEC3NeKBtRXAW0ArPAaRpObJ2gp.svg",
        "isNew": false
      },
      {
        "title": "Lexus",
        "href": "https://raceroms.com/car/lexus",
        "logo": "/sites/raceroms/brands/203-HnTRL8Ei5JylT29G8oqmNCc3dAQ1OeqzxrfjpJ7R-logo.png",
        "isNew": false
      },
      {
        "title": "Lincoln",
        "href": "https://raceroms.com/car/lincoln",
        "logo": "/sites/raceroms/brands/200-OaeQPttiY2pRrVQGK0Gw83NJY1m95UGWUDLiNKVb-logo.png",
        "isNew": false
      },
      {
        "title": "Lotus",
        "href": "https://raceroms.com/car/lotus",
        "logo": "/sites/raceroms/brands/197-BOV7UPoExRSTvWhTrpEbW9WgKS4L0fDXyZLxUPnn.svg",
        "isNew": false
      },
      {
        "title": "Mahindra",
        "href": "https://raceroms.com/car/mahindra",
        "logo": "/sites/raceroms/brands/5128-01K6JAHNW63SWR4RGB81HCHWBX-logo.png",
        "isNew": false
      },
      {
        "title": "MAN",
        "href": "https://raceroms.com/car/man",
        "logo": "/sites/raceroms/brands/194-CdpUkHs2Dgh1QJaNQWSKKh8nZLQegD5X8NB2Zmk2-logo.png",
        "isNew": false
      },
      {
        "title": "Maserati",
        "href": "https://raceroms.com/car/maserati",
        "logo": "/sites/raceroms/brands/191-YzSVEL2QQ71sr028ROmUUBIt2vcNDlE2XgJ6XJdY-logo.png",
        "isNew": false
      },
      {
        "title": "Mazda",
        "href": "https://raceroms.com/car/mazda",
        "logo": "/sites/raceroms/brands/188-is00wxB9L4u1rBNrn7xMVJH6pnAhSdRfo4OQTq7d.svg",
        "isNew": false
      },
      {
        "title": "McLaren",
        "href": "https://raceroms.com/car/mclaren",
        "logo": "/sites/raceroms/brands/185-sIpnX1pXpt1vHym1WHcnFt0Ial45z8CkcYRZ54pI.svg",
        "isNew": false
      },
      {
        "title": "Mercedes",
        "href": "https://raceroms.com/car/mercedes",
        "logo": "/sites/raceroms/brands/182-NSOcD507q1t3vGBZlcmfXajR4yKFlHR2nhAzTk5A.svg",
        "isNew": false
      },
      {
        "title": "MG",
        "href": "https://raceroms.com/car/mg",
        "logo": "/sites/raceroms/brands/448-cH5y14jwmyZ3Utp07lGbpCh1EcnR9ZNPv3nQnLjB-logo.png",
        "isNew": false
      },
      {
        "title": "Mini",
        "href": "https://raceroms.com/car/mini",
        "logo": "/sites/raceroms/brands/179-wTHv7foaFgILrlFNwgMz41hchvDcjmgTDxbL2Knt.svg",
        "isNew": false
      },
      {
        "title": "Mitsubishi",
        "href": "https://raceroms.com/car/mitsubishi",
        "logo": "/sites/raceroms/brands/176-W79J9eLpxQa3E7DiCfhRMIMc03K6DitS97LUAkh4.svg",
        "isNew": false
      },
      {
        "title": "Morgan",
        "href": "https://raceroms.com/car/morgan",
        "logo": "/sites/raceroms/brands/5129-01K6JANCCZPXAH8652N1RM9BTR-logo.png",
        "isNew": false
      },
      {
        "title": "MPM",
        "href": "https://raceroms.com/car/mpm",
        "logo": "/sites/raceroms/brands/5130-01K6JANZ263H4AR493YS7JV9E8-logo.png",
        "isNew": false
      },
      {
        "title": "Nissan",
        "href": "https://raceroms.com/car/nissan",
        "logo": "/sites/raceroms/brands/173-sz2rEhYurua2W46d6Fm8UvWiPF7F0KBrj0fQjq3x-logo.png",
        "isNew": false
      },
      {
        "title": "Opel",
        "href": "https://raceroms.com/car/opel",
        "logo": "/sites/raceroms/brands/170-8CpNLW64ZqFndcnnhrLMUhlUsXDc9a2F8FqC1cIi.svg",
        "isNew": false
      },
      {
        "title": "Pagani",
        "href": "https://raceroms.com/car/pagani",
        "logo": "/sites/raceroms/brands/5131-01K6JAPHSN0QC60FM71PDCTHDC-logo.png",
        "isNew": false
      },
      {
        "title": "Peugeot",
        "href": "https://raceroms.com/car/peugeot",
        "logo": "/sites/raceroms/brands/167-q8jD0YuhppNCdOfHqTBvTgJu6DN81h2ug3dKPfI5-logo.png",
        "isNew": false
      },
      {
        "title": "PGO",
        "href": "https://raceroms.com/car/pgo",
        "logo": "/sites/raceroms/brands/5132-01K6JAQ2N84FCBSRD8TFHTQF3D-logo.png",
        "isNew": false
      },
      {
        "title": "Piaggio",
        "href": "https://raceroms.com/car/piaggio",
        "logo": "/sites/raceroms/brands/5133-01K6JAQH1SN768QPZVYKA7CG32-logo.png",
        "isNew": false
      },
      {
        "title": "Porsche",
        "href": "https://raceroms.com/car/porsche",
        "logo": "/sites/raceroms/brands/164-cLmNS9HNUDQ2ZKB6Yr0EMi75FG4zxJ9sMNS0WS1K.svg",
        "isNew": false
      },
      {
        "title": "Renault",
        "href": "https://raceroms.com/car/renault",
        "logo": "/sites/raceroms/brands/161-zStj4XbuR61tWAygS6UftLcTkTijmRA2obeamZr0-logo.png",
        "isNew": false
      },
      {
        "title": "Rolls Royce",
        "href": "https://raceroms.com/car/rolls-royce",
        "logo": "/sites/raceroms/brands/80-I7VO5Kw2mMLTBLOYgoAfjIblwyM122P20pgkMq1x.svg",
        "isNew": false
      },
      {
        "title": "Saab",
        "href": "https://raceroms.com/car/saab",
        "logo": "/sites/raceroms/brands/158-JRubv2k4G94Ly8oClkqu63qftGqlYTY8tepLYVtF.svg",
        "isNew": false
      },
      {
        "title": "Samsung",
        "href": "https://raceroms.com/car/samsung",
        "logo": "/sites/raceroms/brands/5134-01K6JAQYZ96BCHRMJGXCXWGA6M-logo.png",
        "isNew": false
      },
      {
        "title": "Scion",
        "href": "https://raceroms.com/car/scion",
        "logo": "/sites/raceroms/brands/5135-01K6JARF89JH6E0Q9XQET0YWX1-logo.png",
        "isNew": false
      },
      {
        "title": "Seat",
        "href": "https://raceroms.com/car/seat",
        "logo": "/sites/raceroms/brands/155-eZhBodO1eycHnHtQUaACvH8BhrLxzoHXyY1Ewnkd-logo.png",
        "isNew": false
      },
      {
        "title": "Secma",
        "href": "https://raceroms.com/car/secma",
        "logo": "/sites/raceroms/brands/5136-01K6JAS4HWXMZRFNK4ZVTT35DX-logo.png",
        "isNew": false
      },
      {
        "title": "Skoda",
        "href": "https://raceroms.com/car/skoda",
        "logo": "/sites/raceroms/brands/149-xv2AK6el36AurF1zOGv0ffoq7191XR69idb9BOtv.svg",
        "isNew": false
      },
      {
        "title": "Smart",
        "href": "https://raceroms.com/car/smart",
        "logo": "/sites/raceroms/brands/143-uGWgCdHVsxwCu7EACXLf53qGzpVUA7guA1BOmibC.svg",
        "isNew": false
      },
      {
        "title": "SsangYong",
        "href": "https://raceroms.com/car/ssangyong",
        "logo": "/sites/raceroms/brands/134-pYmbL1GWNWf5VrFRxOFfHeXgQc04rhhyaowWHVFD-logo.png",
        "isNew": false
      },
      {
        "title": "Subaru",
        "href": "https://raceroms.com/car/subaru",
        "logo": "/sites/raceroms/brands/131-rdS2yxH9W0zPIBv9yq9VuDwES7tuDYSW7ZUUvzML-logo.png",
        "isNew": false
      },
      {
        "title": "Suzuki",
        "href": "https://raceroms.com/car/suzuki",
        "logo": "/sites/raceroms/brands/119-VAohA9fqn4nVHzamTBfZfHTgVPeg8EyBcgC7s28A.svg",
        "isNew": false
      },
      {
        "title": "Tata",
        "href": "https://raceroms.com/car/tata",
        "logo": "/sites/raceroms/brands/5137-01K6JASNDSGW1CW26GR1ND1TXB-logo.png",
        "isNew": false
      },
      {
        "title": "Tesla",
        "href": "https://raceroms.com/car/tesla",
        "logo": "/sites/raceroms/brands/5138-01K6JAT1VQZ3QKW94N6NFZ3TPA-logo.png",
        "isNew": false
      },
      {
        "title": "Toyota",
        "href": "https://raceroms.com/car/toyota",
        "logo": "/sites/raceroms/brands/104-UCLDZd691R79d2E6M75iDScuO3eTaCLkfH1ZfRpN.svg",
        "isNew": false
      },
      {
        "title": "Volkswagen",
        "href": "https://raceroms.com/car/volkswagen",
        "logo": "/sites/raceroms/brands/98-vOBRkdLNbnV8AVGHFsvfaZ4G5FPYbwhCXMf5iRLa.svg",
        "isNew": false
      },
      {
        "title": "Volvo",
        "href": "https://raceroms.com/car/volvo",
        "logo": "/sites/raceroms/brands/95-RDWdaz70lBMbroRCPgUXSYwvvHNq8ccRunWkjMTD.svg",
        "isNew": true
      },
      {
        "title": "Westfield",
        "href": "https://raceroms.com/car/westfield",
        "logo": "/sites/raceroms/brands/89-qFBeUv8sPKZUy7Vnzawh5hFDx0xWliRWag2ATGI6-logo.png",
        "isNew": false
      },
      {
        "title": "Wiesmann",
        "href": "https://raceroms.com/car/wiesmann",
        "logo": "/sites/raceroms/brands/5186-01K840W0P0YDVYKFPWYPRTGS88-logo.png",
        "isNew": false
      }
    ]
  },
  {
    "slug": "bikes",
    "title": "Μηχανές",
    "brands": [
      {
        "title": "AJP",
        "href": "https://raceroms.com/bikes/ajp",
        "logo": "/sites/raceroms/brands/5140-01K6JF0Q7BKTH4JYPFRXJSZTFQ-logo.png",
        "isNew": false
      },
      {
        "title": "Aprilia",
        "href": "https://raceroms.com/bikes/aprilia",
        "logo": "/sites/raceroms/brands/5187-01K85MYX10DQ02YWCXBS44X9PY-logo.png",
        "isNew": false
      },
      {
        "title": "Argo",
        "href": "https://raceroms.com/bikes/argo",
        "logo": "/sites/raceroms/brands/5141-01K6JF33G2ZF4PCQ36HZP1AZ2X-logo.png",
        "isNew": false
      },
      {
        "title": "Benelli",
        "href": "https://raceroms.com/bikes/benelli",
        "logo": "/sites/raceroms/brands/5142-01K6JF4820637WJ5AGYPGG30H9-logo.png",
        "isNew": false
      },
      {
        "title": "Bimota",
        "href": "https://raceroms.com/bikes/bimota",
        "logo": "/sites/raceroms/brands/5143-01K6JFA7KVM7KYKHRQE6AEB8TE-logo.png",
        "isNew": false
      },
      {
        "title": "BMW",
        "href": "https://raceroms.com/bikes/bmw",
        "logo": "/sites/raceroms/brands/5188-01K85N6B5TK0659ZSZXY9MGYTK-logo.png",
        "isNew": false
      },
      {
        "title": "Brinxton",
        "href": "https://raceroms.com/bikes/brinxton",
        "logo": "/sites/raceroms/brands/5144-01K6JFBXH00T31FGBFBZ83ZTB8-logo.png",
        "isNew": false
      },
      {
        "title": "Buell",
        "href": "https://raceroms.com/bikes/buell",
        "logo": "/sites/raceroms/brands/5189-01K85NFSVXEYSPNPZEMGPPZ80K-logo.png",
        "isNew": false
      },
      {
        "title": "Campagna Motors",
        "href": "https://raceroms.com/bikes/campagna-motors",
        "logo": "/sites/raceroms/brands/5145-01K6JFEY4R0DR9KB6YK9W77839-logo.png",
        "isNew": false
      },
      {
        "title": "Can-am",
        "href": "https://raceroms.com/bikes/can-am",
        "logo": "/sites/raceroms/brands/5190-01K85P7MJH1Y9ZJDA5WXRS66DP-logo.png",
        "isNew": false
      },
      {
        "title": "CCM Motorcycle",
        "href": "https://raceroms.com/bikes/ccm-motorcycle",
        "logo": "/sites/raceroms/brands/5148-01K6JFRREM7G3QQGC93ZCYC6MV-logo.png",
        "isNew": false
      },
      {
        "title": "CF Moto",
        "href": "https://raceroms.com/bikes/cf-moto",
        "logo": "/sites/raceroms/brands/5147-01K6JFR7XW9N06VQT50QD5132R-logo.png",
        "isNew": false
      },
      {
        "title": "Ducati",
        "href": "https://raceroms.com/bikes/ducati",
        "logo": "/sites/raceroms/brands/5191-01K85P8NZSK3TMTE4JWMZ2KF83-logo.png",
        "isNew": false
      },
      {
        "title": "Energica",
        "href": "https://raceroms.com/bikes/energica",
        "logo": "/sites/raceroms/brands/5149-01K6JFVE6TWDFSX0VM2TXQJB50-logo.png",
        "isNew": false
      },
      {
        "title": "Fantic",
        "href": "https://raceroms.com/bikes/fantic",
        "logo": "/sites/raceroms/brands/5150-01K6JFYZQD710AP93JYSHBNEPN-logo.png",
        "isNew": false
      },
      {
        "title": "GasGas",
        "href": "https://raceroms.com/bikes/gasgas",
        "logo": "/sites/raceroms/brands/5151-01K6JFZJYQAZNHRKAC2EFGJM0E-logo.png",
        "isNew": false
      },
      {
        "title": "Gilera",
        "href": "https://raceroms.com/bikes/gilera",
        "logo": "/sites/raceroms/brands/5192-01K85PAAKNEA3WBH2XFGPCSJ63-logo.png",
        "isNew": false
      },
      {
        "title": "Harley Davidson",
        "href": "https://raceroms.com/bikes/harley-davidson",
        "logo": "/sites/raceroms/brands/5193-01K85PDKKS3S2539A20E7QAVQX-logo.png",
        "isNew": false
      },
      {
        "title": "Honda",
        "href": "https://raceroms.com/bikes/honda",
        "logo": "/sites/raceroms/brands/5194-01K85PG2NYY4B5Q63RA5VRWSY9-logo.png",
        "isNew": false
      },
      {
        "title": "Husqvarna",
        "href": "https://raceroms.com/bikes/husqvarna",
        "logo": "/sites/raceroms/brands/5152-01K6JG2YTXR81V7WT6B1MT4BWW-logo.png",
        "isNew": false
      },
      {
        "title": "Hyosung",
        "href": "https://raceroms.com/bikes/hyosung",
        "logo": "/sites/raceroms/brands/5153-01K6JGAC41D30Y69ADTMKMKGP9-logo.png",
        "isNew": false
      },
      {
        "title": "Hytrack",
        "href": "https://raceroms.com/bikes/hytrack",
        "logo": "/sites/raceroms/brands/5154-01K6JGBD9RANYXB0VNRTCR4BSB-logo.png",
        "isNew": false
      },
      {
        "title": "Indian",
        "href": "https://raceroms.com/bikes/indian",
        "logo": "/sites/raceroms/brands/5155-01K6JGC9V8FD7KCMY2ED2Q6SHR-logo.png",
        "isNew": false
      },
      {
        "title": "Kawasaki",
        "href": "https://raceroms.com/bikes/kawasaki",
        "logo": "/sites/raceroms/brands/5195-01K85PMPF04K68H76WY7V375YT-logo.png",
        "isNew": false
      },
      {
        "title": "KTM",
        "href": "https://raceroms.com/bikes/ktm",
        "logo": "/sites/raceroms/brands/5196-01K85PNC5ZCYQ1SJ4XMJJ4PNTW-logo.png",
        "isNew": false
      },
      {
        "title": "Kymco",
        "href": "https://raceroms.com/bikes/kymco",
        "logo": "/sites/raceroms/brands/5156-01K6JGDHEWVR3PT01CDE5F4KGE-logo.png",
        "isNew": false
      },
      {
        "title": "Linhai",
        "href": "https://raceroms.com/bikes/linhai",
        "logo": "/sites/raceroms/brands/5157-01K6JGF0R3WHCYARBXX3BQKVME-logo.png",
        "isNew": false
      },
      {
        "title": "Macbor",
        "href": "https://raceroms.com/bikes/macbor",
        "logo": "/sites/raceroms/brands/5158-01K6JGHR4E9E1Y19CGMSKVMJQC-logo.png",
        "isNew": false
      },
      {
        "title": "Masai",
        "href": "https://raceroms.com/bikes/masai",
        "logo": "/sites/raceroms/brands/5159-01K6JGPS386FXYW5FDK971RWXZ-logo.png",
        "isNew": false
      },
      {
        "title": "Mash Motorcycle",
        "href": "https://raceroms.com/bikes/mash-motorcycle",
        "logo": "/sites/raceroms/brands/5160-01K6JGQN4VE4M8FA3RZD4HR9FQ-logo.png",
        "isNew": false
      },
      {
        "title": "Moto Guzzi",
        "href": "https://raceroms.com/bikes/moto-guzzy",
        "logo": "/sites/raceroms/brands/5161-01K6JGSBZHN94503FB5EFK1029-logo.png",
        "isNew": false
      },
      {
        "title": "Moto Morini",
        "href": "https://raceroms.com/bikes/moto-morini",
        "logo": "/sites/raceroms/brands/5162-01K6JGTBNTRC9ZD655W0Y89JES-logo.png",
        "isNew": false
      },
      {
        "title": "Motron",
        "href": "https://raceroms.com/bikes/motron",
        "logo": "/sites/raceroms/brands/5163-01K6JGV26V9R90CB0P9DHJXHSR-logo.png",
        "isNew": false
      },
      {
        "title": "MV Agusta",
        "href": "https://raceroms.com/bikes/mv-agusta",
        "logo": "/sites/raceroms/brands/5197-01K85Q8HM57AC99YCYD3G0EANP-logo.png",
        "isNew": false
      },
      {
        "title": "Norton Motorcycle",
        "href": "https://raceroms.com/bikes/norton-motorcycle",
        "logo": "/sites/raceroms/brands/5164-01K6JGVMKX2S6CZ6JEJNVH90DE-logo.png",
        "isNew": false
      },
      {
        "title": "Odes",
        "href": "https://raceroms.com/bikes/odes",
        "logo": "/sites/raceroms/brands/5165-01K6JH337V688AJMEV7RW9R7BC-logo.png",
        "isNew": false
      },
      {
        "title": "Orcal",
        "href": "https://raceroms.com/bikes/orcal",
        "logo": "/sites/raceroms/brands/5166-01K6JH4H492RZVQ02H7D8HYM84-logo.png",
        "isNew": false
      },
      {
        "title": "Piaggio",
        "href": "https://raceroms.com/bikes/piaggio",
        "logo": "/sites/raceroms/brands/5198-01K85QA0YW8813VC514VA2C4AN-logo.png",
        "isNew": false
      },
      {
        "title": "Polaris",
        "href": "https://raceroms.com/bikes/polaris",
        "logo": "/sites/raceroms/brands/291-PyDJA1wfcRFMIxJBf9lrG62sn3yGE2lYa9wLOa3W-logo.png",
        "isNew": false
      },
      {
        "title": "QJ Motors",
        "href": "https://raceroms.com/bikes/qj-motors",
        "logo": "/sites/raceroms/brands/5167-01K6JH5H1AQ5TFA2DCD8KYBRHN-logo.png",
        "isNew": false
      },
      {
        "title": "Quadro",
        "href": "https://raceroms.com/bikes/quadro",
        "logo": "/sites/raceroms/brands/5168-01K6JHFA583764MAEPCF4DWFVY-logo.png",
        "isNew": false
      },
      {
        "title": "Rewaco",
        "href": "https://raceroms.com/bikes/rewaco",
        "logo": "/sites/raceroms/brands/5169-01K6JJ4F5VKG4H56ANPGHBGZ73-logo.png",
        "isNew": false
      },
      {
        "title": "Royal Enfield",
        "href": "https://raceroms.com/bikes/royal-enfield",
        "logo": "/sites/raceroms/brands/5170-01K6JJ6X6FDBD3JKVRTVGYVX9B-logo.png",
        "isNew": false
      },
      {
        "title": "Segway Motors",
        "href": "https://raceroms.com/bikes/segway-motors",
        "logo": "/sites/raceroms/brands/5171-01K6JJ7VQE19NY0F3RQ1S35J0T-logo.png",
        "isNew": false
      },
      {
        "title": "Sherco",
        "href": "https://raceroms.com/bikes/sherco",
        "logo": "/sites/raceroms/brands/5172-01K6JJ90WVAPP9G9Q8TBJESXPT-logo.png",
        "isNew": false
      },
      {
        "title": "Stels",
        "href": "https://raceroms.com/bikes/stels",
        "logo": "/sites/raceroms/brands/5173-01K6JJA2QHK652SQD98C2K9N6F-logo.png",
        "isNew": false
      },
      {
        "title": "Suzuki",
        "href": "https://raceroms.com/bikes/suzuki",
        "logo": "/sites/raceroms/brands/5199-01K85QAH5B1B9WSJD837YZQMQ5-logo.png",
        "isNew": false
      },
      {
        "title": "SWM",
        "href": "https://raceroms.com/bikes/swm",
        "logo": "/sites/raceroms/brands/5175-01K6JJC39S60H1Z6C46DV88P78-logo.png",
        "isNew": false
      },
      {
        "title": "SYM",
        "href": "https://raceroms.com/bikes/sym",
        "logo": "/sites/raceroms/brands/5174-01K6JJBED1AF4V39405N6RSNW9-logo.png",
        "isNew": false
      },
      {
        "title": "TGB",
        "href": "https://raceroms.com/bikes/tgb",
        "logo": "/sites/raceroms/brands/5176-01K6JJD262XBQ8VRBPH1CP3B9B-logo.png",
        "isNew": false
      },
      {
        "title": "Triumph",
        "href": "https://raceroms.com/bikes/triumph",
        "logo": "/sites/raceroms/brands/296-XZzVDtBpQq0zbU3f8NEcmRAAuHjMMYlHqXUiYtXD-logo.png",
        "isNew": false
      },
      {
        "title": "Vespa",
        "href": "https://raceroms.com/bikes/vespa",
        "logo": "/sites/raceroms/brands/5177-01K6JJEAJQX9VC2DY4ZE5MRR93-logo.png",
        "isNew": false
      },
      {
        "title": "Voge",
        "href": "https://raceroms.com/bikes/voge",
        "logo": "/sites/raceroms/brands/5178-01K6JJET37RHN87ZC6Z2E4EMJ2-logo.png",
        "isNew": false
      },
      {
        "title": "Yamaha",
        "href": "https://raceroms.com/bikes/yamaha",
        "logo": "/sites/raceroms/brands/5200-01K85QH829BCVNRW297B7ZKP40-logo.png",
        "isNew": false
      },
      {
        "title": "Zero Motorcycle",
        "href": "https://raceroms.com/bikes/zero-motorcycle",
        "logo": "/sites/raceroms/brands/5179-01K6JJFSHEXV5D690004ZZZRPS-logo.png",
        "isNew": false
      }
    ]
  },
  {
    "slug": "jetski",
    "title": "Jetski",
    "brands": [
      {
        "title": "Kawasaki",
        "href": "https://raceroms.com/jetski/kawasaki",
        "logo": "/sites/raceroms/brands/248-al9rc3u6ee0d1NmuZfb35jCEpNscnkhhefKRhY6w-logo.png",
        "isNew": false
      },
      {
        "title": "Sea-doo",
        "href": "https://raceroms.com/jetski/sea-doo",
        "logo": "/sites/raceroms/brands/251-NLKyN4a7odbF1y2h4QHRZkH2BmvW6jBB77wOVuRT-logo.webp",
        "isNew": false
      },
      {
        "title": "Taiga",
        "href": "https://raceroms.com/jetski/taiga",
        "logo": "/sites/raceroms/brands/5201-01K85X2NX1EAXAX3AH5TN48090-logo.png",
        "isNew": false
      },
      {
        "title": "Yamaha",
        "href": "https://raceroms.com/jetski/yamaha",
        "logo": "/sites/raceroms/brands/254-FjDSf7ZMMscsc87g7TmPVEN73aEotgWgEqH2m0UH-logo.webp",
        "isNew": false
      }
    ]
  },
  {
    "slug": "motorboats",
    "title": "Σκάφη",
    "brands": [
      {
        "title": "Caterpillar",
        "href": "https://raceroms.com/motorboats/caterpillar",
        "logo": "/sites/raceroms/brands/451-UrCSKxWDIv46cI42eJiihEJPnWdhrwbqxnBDL5Io-logo.png",
        "isNew": false
      },
      {
        "title": "Cummins Marine",
        "href": "https://raceroms.com/motorboats/cummins-marine",
        "logo": "/sites/raceroms/brands/454-GbwMe0ll37idbvmnlyZJwwJrPv0umt0z30IwLFnH-logo.png",
        "isNew": false
      },
      {
        "title": "Daedong Marine Tech",
        "href": "https://raceroms.com/motorboats/daedong-marine-tech",
        "logo": "/sites/raceroms/brands/456-i4vZc6pTSOsW9ebSYrcxHKK7z1kxyawAFKqhHIbL-logo.png",
        "isNew": false
      },
      {
        "title": "Deutz",
        "href": "https://raceroms.com/motorboats/deutz",
        "logo": "/sites/raceroms/brands/459-eiuSjclL17ZggE57AvO7yu5Uea5yDEWgffEsyGC5-logo.png",
        "isNew": false
      },
      {
        "title": "FPT",
        "href": "https://raceroms.com/motorboats/fpt",
        "logo": "/sites/raceroms/brands/462-WiXvwsIrj09J3QRUe34CqfLh9JPci1uXtfYVJzOs-logo.png",
        "isNew": false
      },
      {
        "title": "Honda Marine",
        "href": "https://raceroms.com/motorboats/honda-marine",
        "logo": "/sites/raceroms/brands/465-ZZm9syJKQtHueBOzuaEzUjBTX2me1C5DOxOVkdF9-logo.png",
        "isNew": false
      },
      {
        "title": "Hyundai Seasall",
        "href": "https://raceroms.com/motorboats/hyundai-seasall",
        "logo": "/sites/raceroms/brands/467-IH2jfih3PxFjbEG6On4P5vCFSosqv6Q5FxTvY3Tp-logo.png",
        "isNew": false
      },
      {
        "title": "Johnson",
        "href": "https://raceroms.com/motorboats/johnson",
        "logo": "/sites/raceroms/brands/470-NtSlnmrpUjoKg9yCTRyxD6LcNVXHR4n0eDdZN5yx-logo.png",
        "isNew": false
      },
      {
        "title": "Lombardini",
        "href": "https://raceroms.com/motorboats/lombardini",
        "logo": "/sites/raceroms/brands/473-iwTI3AKCo4qSrEWn5PDyQqWBudOttYV8tWIM5f1I-logo.png",
        "isNew": false
      },
      {
        "title": "Man",
        "href": "https://raceroms.com/motorboats/man",
        "logo": "/sites/raceroms/brands/476-FG8IY4zjCseEI2PcR1FKHTCTGd08U1dIZrZ1C6Fn-logo.png",
        "isNew": false
      },
      {
        "title": "Mercury",
        "href": "https://raceroms.com/motorboats/mercury",
        "logo": "/sites/raceroms/brands/479-e4elvroG0lrYdPw6DYKQvhzcI7v0eCdfmADMOfHu-logo.png",
        "isNew": false
      },
      {
        "title": "Scania",
        "href": "https://raceroms.com/motorboats/scania",
        "logo": "/sites/raceroms/brands/482-lqIFRypfyTEDrfP0MsrCQKFbfOx49mYT8HNpk7ej-logo.png",
        "isNew": false
      },
      {
        "title": "Selva",
        "href": "https://raceroms.com/motorboats/selva",
        "logo": "/sites/raceroms/brands/485-xgjkeQ0bhSjo7a9BBf64JuaRWsEpBjuKd7YcDXvG-logo.png",
        "isNew": false
      },
      {
        "title": "Suzuki",
        "href": "https://raceroms.com/motorboats/suzuki",
        "logo": "/sites/raceroms/brands/5202-01K85XCYW5QJVHAJW76VZT7ZDR-logo.png",
        "isNew": false
      },
      {
        "title": "Volkswagen Marine",
        "href": "https://raceroms.com/motorboats/volkswagen-marine",
        "logo": "/sites/raceroms/brands/488-3k4RQUawzjxBSclcM7qyw68ucrHhuUE32d1HKNwk.svg",
        "isNew": false
      },
      {
        "title": "Volvo Penta",
        "href": "https://raceroms.com/motorboats/volvo-penta",
        "logo": "/sites/raceroms/brands/5203-01K85XGF7FBPN5S0PSMCQSJN4M-logo.png",
        "isNew": false
      },
      {
        "title": "Yamaha",
        "href": "https://raceroms.com/motorboats/yamaha",
        "logo": "/sites/raceroms/brands/5204-01K85XHNBKWNYH4EVEETGYEZAH-logo.png",
        "isNew": false
      },
      {
        "title": "Yanmar",
        "href": "https://raceroms.com/motorboats/yanmar",
        "logo": "/sites/raceroms/brands/491-YpopSaaH5gnDcHCVRhGnGfhwoGTZ5spGGBTia74V-logo.png",
        "isNew": false
      }
    ]
  },
  {
    "slug": "tractors",
    "title": "Τρακτέρ",
    "brands": [
      {
        "title": "Agco",
        "href": "https://raceroms.com/tractors/agco",
        "logo": "/sites/raceroms/brands/307-SkI10nmLwPmNZSFwE6kQ7PavjRsbbbdMFMApWuWR-logo.png",
        "isNew": false
      },
      {
        "title": "Batemann",
        "href": "https://raceroms.com/tractors/batemann",
        "logo": "/sites/raceroms/brands/310-s37nrvvcmFIXzOm6PT8wxYkd7PCTFPhI1JEItSA5-logo.png",
        "isNew": false
      },
      {
        "title": "Bobard",
        "href": "https://raceroms.com/tractors/bobard",
        "logo": "/sites/raceroms/brands/313-zZ0oZU5lzxQFK1B9VxMcpMDHFGztCpHcLQ4ryMfY-logo.png",
        "isNew": false
      },
      {
        "title": "Bobcat",
        "href": "https://raceroms.com/tractors/bobcat",
        "logo": "/sites/raceroms/brands/316-XSskILYrOpYZCIH0gZjk05hIJAT9YhCzMSKcM4FL-logo.png",
        "isNew": false
      },
      {
        "title": "Branson",
        "href": "https://raceroms.com/tractors/branson",
        "logo": "/sites/raceroms/brands/319-eVIwtgE85lwpNcuii1dJGcvzCJXQdxZRBbG37jN6-logo.png",
        "isNew": false
      },
      {
        "title": "Case IH",
        "href": "https://raceroms.com/tractors/case-ih",
        "logo": "/sites/raceroms/brands/322-hSdL5rhLyHKdEQWwagFBVTwA9GZOJNcnKkDlm7KA-logo.png",
        "isNew": false
      },
      {
        "title": "Challenger",
        "href": "https://raceroms.com/tractors/challenger",
        "logo": "/sites/raceroms/brands/325-Ae1zoml8oLHqazvXSZmfSpFuS3tdGE21yEB5NPv4.svg",
        "isNew": false
      },
      {
        "title": "Claas",
        "href": "https://raceroms.com/tractors/claas",
        "logo": "/sites/raceroms/brands/328-DUWW3x3ZSmqdHI4ZaOpCPtOEyp7mA9bHZ5FaSw0G-logo.png",
        "isNew": false
      },
      {
        "title": "Deutz",
        "href": "https://raceroms.com/tractors/deutz",
        "logo": "/sites/raceroms/brands/331-GuU4E6H2iZw7eG1C4xQGTn2BxHU3erNFqUEdv4zu-logo.png",
        "isNew": false
      },
      {
        "title": "Fendt",
        "href": "https://raceroms.com/tractors/fendt",
        "logo": "/sites/raceroms/brands/334-fPAGwsuI3jFslNRsAUlaeqJL10eLn34OduvUl3jK-logo.png",
        "isNew": false
      },
      {
        "title": "Hattat",
        "href": "https://raceroms.com/tractors/hattat",
        "logo": "/sites/raceroms/brands/337-OvBCivuMBFi2NuEoW4QehpQBYvXqoHJWx7HKU1z4-logo.png",
        "isNew": false
      },
      {
        "title": "Hydrema",
        "href": "https://raceroms.com/tractors/hydrema",
        "logo": "/sites/raceroms/brands/340-QJXorIblZBY8LPmw2dp1tFY2VM7LTrBBe2XVzuOc.svg",
        "isNew": false
      },
      {
        "title": "Iseki",
        "href": "https://raceroms.com/tractors/iseki",
        "logo": "/sites/raceroms/brands/343-7Nq4n5wopkmGWZirqKZ8hIxrcrtwWySrxErGYBOW-logo.png",
        "isNew": false
      },
      {
        "title": "JCB",
        "href": "https://raceroms.com/tractors/jcb",
        "logo": "/sites/raceroms/brands/346-Zocg3rc01Na0neutKqHGOIVAmBS7jVhl1PDj8NUY-logo.png",
        "isNew": false
      },
      {
        "title": "John Deere",
        "href": "https://raceroms.com/tractors/john-deere",
        "logo": "/sites/raceroms/brands/349-bKQ3Rr7Jz4rWmtvquogHYA3XMFzhdFnuTKeszKL0-logo.png",
        "isNew": false
      },
      {
        "title": "Kioti",
        "href": "https://raceroms.com/tractors/kioti",
        "logo": "/sites/raceroms/brands/352-zdhzjBBuVwKKzfhKRlSxlHHabetlae1rYHs3J3iP-logo.png",
        "isNew": false
      },
      {
        "title": "Krone",
        "href": "https://raceroms.com/tractors/krone",
        "logo": "/sites/raceroms/brands/355-6Hi7LKqN1GyyIuO3nmUCCQhDrE3weNrhf3VmlX2U-logo.png",
        "isNew": false
      },
      {
        "title": "Kubota",
        "href": "https://raceroms.com/tractors/kubota",
        "logo": "/sites/raceroms/brands/358-IZ1MudU4c2BY8HgmR4giQJ4cM04xreHzWuj1eVOf-logo.png",
        "isNew": false
      },
      {
        "title": "Lamborghini",
        "href": "https://raceroms.com/tractors/lamborghini",
        "logo": "/sites/raceroms/brands/361-YjyZLlXxDMCWdpOpSTEnWyB3K1qI3eDDk8wKzCr7-logo.png",
        "isNew": false
      },
      {
        "title": "Landini",
        "href": "https://raceroms.com/tractors/landini",
        "logo": "/sites/raceroms/brands/364-M403HGu1SEhyr77fxt5korurYz5jPBewZ60pdC7E.svg",
        "isNew": false
      },
      {
        "title": "Lindner",
        "href": "https://raceroms.com/tractors/lindner",
        "logo": "/sites/raceroms/brands/367-Z7tdWw4M7PqmCrbEdSj9lvoxCjjs2h0Z9adgZrbe-logo.png",
        "isNew": false
      },
      {
        "title": "LS",
        "href": "https://raceroms.com/tractors/ls",
        "logo": "/sites/raceroms/brands/370-PvT7Yxkt8S4sRi8YgMKm24cuuEFLbdOKZnfZZyvH-logo.png",
        "isNew": false
      },
      {
        "title": "Manitou",
        "href": "https://raceroms.com/tractors/manitou",
        "logo": "/sites/raceroms/brands/373-J1RbWrc4yj8M6YlH7kX7ogNHpbe2v6B7m2OEphme-logo.png",
        "isNew": false
      },
      {
        "title": "Massey Ferguson",
        "href": "https://raceroms.com/tractors/massey-ferguson",
        "logo": "/sites/raceroms/brands/376-I93eR6Ba5mbQkRarSzNTuPKqrzlDQ0euuFye6tDH-logo.png",
        "isNew": false
      },
      {
        "title": "Mc Cormick",
        "href": "https://raceroms.com/tractors/mc-cormick",
        "logo": "/sites/raceroms/brands/379-LEdh58ny6kBfsxluOHDfSZY3Op7iuT32jgWipqaH-logo.png",
        "isNew": false
      },
      {
        "title": "Merlo",
        "href": "https://raceroms.com/tractors/merlo",
        "logo": "/sites/raceroms/brands/382-ptBumqjRUyW4e3mYx9I2OIxrYacRJIVoQZ2NgDWI-logo.png",
        "isNew": false
      },
      {
        "title": "Mitsubishi Agriculture",
        "href": "https://raceroms.com/tractors/mitsubishi-agriculture",
        "logo": "/sites/raceroms/brands/385-YLcJVj4ygKPgmaM8U7PepIkolh3yepjX1b3UGKTO-logo.png",
        "isNew": false
      },
      {
        "title": "New Holland",
        "href": "https://raceroms.com/tractors/new-holland",
        "logo": "/sites/raceroms/brands/388-UAgEsqV7rb18ZtKjFN6wbgCiqj2tmHKxQfSG6k5O-logo.png",
        "isNew": false
      },
      {
        "title": "Same",
        "href": "https://raceroms.com/tractors/same",
        "logo": "/sites/raceroms/brands/391-Tegg9F5zr6Wk7efTOUC8GlvR4fHXkOGPo0sQE75r-logo.png",
        "isNew": false
      },
      {
        "title": "Steyr",
        "href": "https://raceroms.com/tractors/steyr",
        "logo": "/sites/raceroms/brands/394-BkW9q9YF3fqmo0R8WH6AqqVKRpxnsaqAnrPlW2o3-logo.png",
        "isNew": false
      },
      {
        "title": "TYM",
        "href": "https://raceroms.com/tractors/tym",
        "logo": "/sites/raceroms/brands/397-xuLz2lqw9ArmJrAiwFzI8JTkQkWYnAc5OJDTOeuK-logo.png",
        "isNew": false
      },
      {
        "title": "Valtra",
        "href": "https://raceroms.com/tractors/valtra",
        "logo": "/sites/raceroms/brands/400-mMs7r5wHTdJ4ARtj2pLlNpXDCTFCoXttHdNpnPmy-logo.png",
        "isNew": false
      },
      {
        "title": "Yanmar",
        "href": "https://raceroms.com/tractors/yanmar",
        "logo": "/sites/raceroms/brands/403-zL97H3HfqKkL8y7wKHQg3Zw8Dg6tDGuK8VuXj3WN-logo.png",
        "isNew": false
      },
      {
        "title": "Zetor",
        "href": "https://raceroms.com/tractors/zetor",
        "logo": "/sites/raceroms/brands/406-vvt7ehlQBsxSkeVfu9i6KTfeDxzgqPqLUOhgaeXs-logo.png",
        "isNew": false
      }
    ]
  },
  {
    "slug": "trucks",
    "title": "Φορτηγά",
    "brands": [
      {
        "title": "Cummins",
        "href": "https://raceroms.com/trucks/cummins",
        "logo": "/sites/raceroms/brands/409-6sIp6DhBUXhpa8ulX5sWIaaxsvT9t1gcjpIb8YV0-logo.png",
        "isNew": false
      },
      {
        "title": "DAF",
        "href": "https://raceroms.com/trucks/daf",
        "logo": "/sites/raceroms/brands/412-ZWeFOe2H6x8Odbm5YGm2rD8wcA4pSbutHMvJhbs7-logo.png",
        "isNew": false
      },
      {
        "title": "Detroit-Diesel",
        "href": "https://raceroms.com/trucks/detroit-diesel",
        "logo": "/sites/raceroms/brands/415-uFTHaNCXkYUAtKIibVcGGRuZ7SP8XFTzLpe9hrAX-logo.png",
        "isNew": false
      },
      {
        "title": "Dodge",
        "href": "https://raceroms.com/trucks/dodge",
        "logo": "/sites/raceroms/brands/418-GU3VYX9QWYjAvHoZdvLgDC7ZUOqXtmQ8VoCeQkKz-logo.png",
        "isNew": false
      },
      {
        "title": "Freightliner",
        "href": "https://raceroms.com/trucks/freightliner",
        "logo": "/sites/raceroms/brands/421-if5wQFcHpxBBQoxbSEDyMPQKblxkUwb6h6F3vnmw-logo.png",
        "isNew": false
      },
      {
        "title": "Iveco",
        "href": "https://raceroms.com/trucks/iveco",
        "logo": "/sites/raceroms/brands/424-qTpEzDULiZ65YhjtdrxsDt1m33SdhguxCRZF5C1D-logo.png",
        "isNew": false
      },
      {
        "title": "Mack",
        "href": "https://raceroms.com/trucks/mack",
        "logo": "/sites/raceroms/brands/427-btU4QiPdsvEXtea6Fz5cP0y2gOxoDsVfNfX7nNiC-logo.png",
        "isNew": false
      },
      {
        "title": "MAN",
        "href": "https://raceroms.com/trucks/man",
        "logo": "/sites/raceroms/brands/430-9BMRj5HAYogaIDC4CMNcFPhQgNXZ9wrEMyme6lLW.png",
        "isNew": false
      },
      {
        "title": "Mercedes",
        "href": "https://raceroms.com/trucks/mercedes",
        "logo": "/sites/raceroms/brands/433-uAJhAvLsYfdKUeJloygYxX1JUaHS9JdzuSq3J5he-logo.png",
        "isNew": false
      },
      {
        "title": "Renault",
        "href": "https://raceroms.com/trucks/renault",
        "logo": "/sites/raceroms/brands/436-IthIysCWqyZzOZ9bin4fHICPFA1uLv18aSrWFIy8-logo.png",
        "isNew": false
      },
      {
        "title": "Scania",
        "href": "https://raceroms.com/trucks/scania",
        "logo": "/sites/raceroms/brands/439-FhYJU4vACxE7KeA8iqpRqyz7Ogxp29SjjZCCNLdb-logo.png",
        "isNew": false
      },
      {
        "title": "Volvo",
        "href": "https://raceroms.com/trucks/volvo",
        "logo": "/sites/raceroms/brands/442-T5YxXIGxRcmDxh3SGRWtfzHNILx5MdoOnspuew6T-logo.png",
        "isNew": false
      }
    ]
  }
];

export const specialty: string[] = [
  "Η οδήγηση δεν είναι απλώς μια διαδικασία – είναι εμπειρία. Ως οδηγοί γνωρίζουμε ότι κάθε στιγμή πίσω από το τιμόνι μπορεί να γίνει μοναδική. Με την εξειδίκευσή μας στο chip tuning και το ECU remapping, στοχεύουμε να σας προσφέρουμε την καλύτερη δυνατή εμπειρία οδήγησης με το όχημά σας. Η βελτιστοποίηση ECU αυξάνει την ιπποδύναμη, βελτιώνει τη ροπή και μειώνει την κατανάλωση καυσίμου, ενώ ταυτόχρονα εξασφαλίζει ομαλότερη λειτουργία και άμεση απόκριση στο γκάζι. Μέσα από προηγμένες τεχνικές ρύθμισης προσαρμόζουμε το αυτοκίνητο σας στις ανάγκες σας, ώστε κάθε διαδρομή να γίνεται απολαυστική και μοναδική.",
  "Στη Raceroms ειδικευόμαστε στο chip tuning και το ECU remapping, προσφέροντας βελτίωση απόδοσης κινητήρα για κάθε τύπο οχήματος και μοντέλου. Η φιλοσοφία μας βασίζεται στη μέγιστη ισχύ και αποδοτικότητα, με απόλυτο σεβασμό στη μακροζωία του κινητήρα και τις ιδιαιτερότητες του κάθε αυτοκινήτου. Με εξατομικευμένη χαρτογράφηση ECU (custom tuning), εξασφαλίζουμε την ιδανική ισορροπία ανάμεσα σε: Αύξηση ιπποδύναμης και ροπής. Μείωση κατανάλωσης καυσίμου. Ομαλή και ασφαλή λειτουργία του κινητήρα. Η εμπειρία μας στη βελτίωση αυτοκινήτων μάς δίνει τη δυνατότητα να προσφέρουμε λύσεις που συνδυάζουν δύναμη, αξιοπιστία και απολαυστική οδηγική εμπειρία.",
  "Προσφέρουμε το εξειδικευμένο λογισμικό μας και σε επαγγελματίες του χώρου. Η Raceroms συνεργάζεται με συνεργάτες και επαγγελματίες βελτίωσης αυτοκινήτων, παρέχοντας έτοιμα tuning files και custom ECU remapping λογισμικό που μπορούν να εγκατασταθούν εύκολα στους πελάτες τους. Με την εμπειρία και την τεχνογνωσία μας, εξασφαλίζετε: Αξιόπιστα και δοκιμασμένα tuning files για διαφορετικά οχήματα και ECUs. Επαγγελματική υποστήριξη για την εγκατάσταση και εφαρμογή τους. Δυνατότητα συνεργασίας με προσαρμοσμένες λύσεις για το δικό σας πελατολόγιο.",
  "Επιλέξτε το όχημά σας και ανακαλύψτε τα αποτελέσματα του chip tuning. Μέσα από αποδεδειγμένες και ασφαλείς διαδικασίες ECU remapping, μπορείτε να δείτε πώς η βελτιστοποίηση του κινητήρα βελτιώνει την απόδοση του αυτοκινήτου σας. Με τη ρύθμιση της Raceroms εξασφαλίζετε: Αύξηση ιπποδύναμης για κορυφαία απόδοση. Βελτίωση ροπής για πιο δυναμική και απολαυστική οδήγηση. Μείωση κατανάλωσης καυσίμου χωρίς συμβιβασμούς στην ισχύ. Η τεχνογνωσία μας στο chip tuning και η χρήση εξελιγμένων διαδικασιών μάς επιτρέπουν να προσφέρουμε λύσεις που συνδυάζουν δύναμη, οικονομία και αξιοπιστία.",
  "Ξεκλειδώστε τις πραγματικές δυνατότητες του αυτοκινήτου σας με επαγγελματικό chip tuning. Μέσα από εξειδικευμένο ECU remapping, προσφέρουμε: Μεγαλύτερη ισχύ και απόδοση κινητήρα. Οικονομικότερη κατανάλωση καυσίμου χωρίς απώλεια δύναμης. Πιο άνετη και απολαυστική εμπειρία οδήγησης με βελτιωμένη απόκριση γκαζιού. Η βελτίωση ECU της Raceroms συνδυάζει δύναμη, οικονομία και αξιοπιστία, μετατρέποντας κάθε διαδρομή σε μια μοναδική εμπειρία.+"
];

export const equipment: Equipment[] = [
  {
    "title": "CMD Flash",
    "href": "https://raceroms.com/equipment/cmd-flash",
    "image": "/sites/raceroms/equipment/58-RfRFRn3YcF7Yi6hONYwrbXYu2Za8ZbPj2ZJcl560-preview.jpg"
  },
  {
    "title": "Alientech Kess3",
    "href": "https://raceroms.com/equipment/alietech-kess3",
    "image": "/sites/raceroms/equipment/59-8DD7s7HctHAfnJ8B3PcX6ehINaA9NGZiiwIqtBFp-preview.jpg"
  },
  {
    "title": "Autotuner",
    "href": "https://raceroms.com/equipment/autotuner",
    "image": "/sites/raceroms/equipment/60-1yqOWzPgnf1zycOtXqiFT8xWjjZ1HsND0j75IURs-preview.jpg"
  },
  {
    "title": "Flex",
    "href": "https://raceroms.com/equipment/flex",
    "image": "/sites/raceroms/equipment/61-J1Bqs9UQjQSOE03SS4iezkAWBYd9cCqYfghNbcjk-preview.jpg"
  },
  {
    "title": "BFlash",
    "href": "https://raceroms.com/equipment/bflash",
    "image": "/sites/raceroms/equipment/62-BLZeJFwy9R4HQ1B1M8mBRyIHTkolusduxmXdN7nE-preview.jpg"
  },
  {
    "title": "Dimsport New Genius",
    "href": "https://raceroms.com/equipment/dimsport-new-genius",
    "image": "/sites/raceroms/equipment/63-kAxdSBipAqfXrDJAYmsLXQVmyOcnQZKEW7VPGhuC-preview.jpg"
  },
  {
    "title": "Dimsport New Trasdata",
    "href": "https://raceroms.com/equipment/dimsport-new-trasdata",
    "image": "/sites/raceroms/equipment/64-wJlD9qFnO5k8xvKmH4O8xAL6FIPs0kJvcMnmAuzB-preview.jpg"
  },
  {
    "title": "Δυναμόμετρο",
    "href": "https://raceroms.com/equipment/dyno",
    "image": "/sites/raceroms/equipment/57-Gop1liCmIGvIXImYFkpu6lfhJcVDnxMewkJ4VLWp-preview.jpg"
  }
];

export const reviews: Review[] = [
  {
    "text": "Απόλυτα ευχαριστημένος με όλη τη δουλειά που έγινε στο αυτοκίνητό μου και με το αποτέλεσμα. Πολύ έμπειρος ο Γιώργος στο είδος του, ευγενικός, ειλικρινής και πάνω από όλα επαγγελματίας. Σας τον συστήνω ανεπιφύλακτα.",
    "author": "Παναγιωτης Σ."
  },
  {
    "text": "Qashqai j11 1.5 dci.. Πολύ εξυπηρετικός ο Γιώργος και με καλή διάθεση.. Το αμαξι +40hp  και γεμάτο παντού. Μετά από μερικούς μήνες όλα λειτουργούν ρολόι.",
    "author": "Klimis C."
  },
  {
    "text": "Απολυτα ικανοποιημενος με το αποτελεσμα παρολο που το αυτοκινητο ειναι ατμοσφαιρικο η διαφορα ηταν αισθητη.",
    "author": "Alexandros P."
  },
  {
    "text": "Παιδιά μεγάλη αλλαγή το αμάξι πετάει και με καλή κατανάλωση έπαθα πλάκα ...",
    "author": "Antonis N."
  },
  {
    "text": "Στάδιο 1 σε audi a3 2.0tdi και πολύ ευχαριστημένος με το αποτέλεσμα. Είχα παράλληλο εγκέφαλο και μου εξήγησε ο Γιώργος με υπομονή τα αρνητικά του. Αφαιρεθηκε ο παράλληλος και έγινε πρόγραμμα από την αρχή και το αμάξι δεν έχει καμία σχέση με πριν.",
    "author": "giannis p."
  },
  {
    "text": "Άψογος ο Γιώργος,γνωρίζει πολύ καλά τι κάνει και σου δίνει απαντήσεις σε όλες σου τις απορίες,χωρίς να προσπαθήσει να σε κοροϊδέψει ούτε να σου πουλήσει φουμαρα.καθεται μόνος του και κάνει το λογισμικό για το αυτοκίνητό σου και εννοείται μετά το βλέπεις και στην πράξη μαζί του, στο δρόμο σε πραγματικές συνθήκες...στην αρχή σίγουρα όπως όλοι μας ήμαστε διστακτικοί αλλά εκεί καταλαβαίνεις ότι έχεις να κάνεις με άνθρωπο που το κατέχει και γνωρίζει πολύ καλά τι κάνει...,μπορώ να γράφω όλη μέρα για τα θετικά... ΜΠΡΑΒΟ ΤΕΛΕΙΟΣ..για την ιστορία no nissan X trail 1.6dci.\r\n(130hp--->168hp).",
    "author": "kalfasgiannis fishing"
  },
  {
    "text": "Με διαφορα ο καλύτερος προγραμματιστής !\r\nΣυζητήσιμος και πρόθυμος να λυθούν όλα τα θέματα του αυτοκινήτου μου .\r\nΤο fiesta μου πλέον πετάει.",
    "author": "Kostas M."
  },
  {
    "text": "Έμεινα πολύ ευχαριστημένος. Πολύ καλή εξυπηρέτηση!!! Ο Γιώργος μου απάντησε σε όλες τις απορίες που είχα για την αναβάθμιση του κινητήρα . Θα τον συστήσω σίγουρα και σε άλλους.",
    "author": "Chris B."
  },
  {
    "text": "Έμπειρος ο Γιώργος κ πολύ καλό παιδί. Αν το αμάξι σου έχει προϋποθέσεις για μεγαλη βελτίωση θα σε ξαφνιάσει το αποτέλεσμα. Αν δει ομως ότι ο κινητήρας σου δεν μπορεί να αντέξει πολλές βελτιώσεις κ θα γίνει επικίνδυνο, τότε θα στο βελτιώσει μέχρι εκεί που του επιτρέπουν τα δεδομένα του, επαγγελματίας. Τον συστήνω ανεπιφύλακτα.",
    "author": "Rafail V."
  },
  {
    "text": "Σωστη επιχειρηση με σωστη συμπεριφορα πηγαινεις γινεται η δουλεια σου φευγεις κ δεν ξανα ασχολεισαι...\r\nΠιστεψτε με πολυ σημαντικο το τελευταιο...",
    "author": "Evangelos C."
  },
  {
    "text": "Πραγματικά δεν έχω λόγια. Η δουλειά που έγινε στο αυτοκίνητο μου είναι από άλλο πλανήτη. Δυνατό όλο το φάσμα και πλέον δεν κόβει πουθενά. Φοβερή αντιμετώπιση και τρομερή δουλειά το λέω και θα το λέω παντού. Προτιμήστε όλοι χωρίς δεύτερη σκέψη.",
    "author": "DIMITRIS A."
  },
  {
    "text": "Απόλυτα ικανοποιημένος από την βελτίωση του αυτοκινήτου.  Ταξίδεψα  με το που το πήρα και είδα αμέσως τη διαφορά.  Πιο ξεκούραστος  κινητήρας και γρηγορότερη επιτάχυνση. Ο Γιώργος  άψογος επαγγελματίας και συνεχής επικοινωνία μαζί μου για να βεβαιωθεί για την λειτουργία του κινητήρα. Το συστήνω ανεπιφύλακτα",
    "author": "thanasis k."
  },
  {
    "text": "Φοβερός άνθρωπος ο Γιώργος. Μου εξήγησε τα πάντα ακριβώς όπως έχουν και όχι όπως τα διάβασα αλλου. Επαγγελματίας σε ολους τους τομείς και με το παραπάνω. Φυσικα τον συστήνω σε ολους χωρίς δεύτερη σκέψη. Να είσαι καλα σε ευχαριστώ για ολα.",
    "author": "Theo T."
  },
  {
    "text": "Είδα διαφορά στο αυτοκίνητο πήρε αυτά που έπρεπε να πάρει ως εκεί που είπε ο Γιώργος. Όσον αφορά τον Γιώργο επαγγελματίας συνεργασιμος με ότι απορία είχα να μου την λύσει και με επικοινωνία και μετά το πρόγραμμα με ρώτησε να δει πως βλέπω το αυτοκίνητο ο καλύτερος Γιώργο ευχαριστώ τον προτείνω ανεπιφύλακτα",
    "author": "ARGHI DJRLS"
  },
  {
    "text": "Φοβερή δουλειά στο αυτοκίνητο μου και εξαιρετική αντιμετωπιση από τον Γιώργο. Μου είπε πράγματα που οι άλλοι έκρυβαν χωρίς να φοβηθεί αν θα με χάσει από πελάτη. Όλα τα επόμενα αυτοκίνητα θα τα κάνω πάλι εκεί χωρίς κανένα ενδοιασμό. Ευχάριστω ξανά για όλα!!",
    "author": "mariomponi 1982"
  },
  {
    "text": "Πολύ καλή δουλειά με πολύ καλό αποτέλεσμα!\r\nΌταν είσαι επαγγελματίας σε αυτό που κάνεις φαίνεται.\r\nΜπράβο στο Γιώργο!!!",
    "author": "Vasilis K."
  },
  {
    "text": "Εξαιρετικός στην  δουλειά του και γνώστης  σε αυτό που κάνει με επιτυχία  μπράβο Γιώργο!",
    "author": "Tassos S."
  },
  {
    "text": "Φοβερος επαγγελματιας και τρομερα εξυπηρετικος ο Γιωργος. Τον καλεσα τελευταια στιγμη και ηρθε να με εξυπηρετησει αμεσα. Προχωρησα σε stage 1 σε opel grandland x. Ειμαι πολυ ευχαριστημενος και απο την αποδοση του αυτοκινητου αλλα και απο τον Γιωργο. Τον συστηνω με κλειστα τα ματια",
    "author": "Σπυρος"
  },
  {
    "text": "Από τα καλύτερα παιδια και επαγγελματίες που γνώρισα ποτέ. Άριστοι σε όλα,ο Γιώργος απλά υπέρτατος!!!!\r\nΣυστήνω ανεπιφύλακτα.\r\nΕυχαριστώ",
    "author": "Mr Tag"
  },
  {
    "text": "άψογος επαγελματιας,καταπληκτική δουλειά....μου έλυσε όλες της απορίες...το αυτοκίνητο πάει τελεία",
    "author": "Rafail R."
  },
  {
    "text": "Σημερα επισκεφθηκα το Γιωργο για να αναβαθμισω το αυτοκινητο μου (1ο σταδιο). Οτι και να πω ειναι λιγο. Εξυπηρετικοτατος, αριστος επαγγελματιας, αψογος στη δουλεια του...και ειλικρινης. Εμεινα πολυ ευχαριστημενος απο τη δουλεια του. Φευγοντας ηταν σαν να οδηγουσα αλλο αυτοκινητο. Τον συνιστω ανεπιφυλακτα...με κλειστα τα ματια!! Ευχαριστω πολυ Γιωργο!!",
    "author": "Sakis"
  },
  {
    "text": "Κερδισα και σε ενα διαγωνισμο που εκανε η Raceroms στο Facebook και αφου ημουν ο τυχερος πηγα να παρω το δωρο μου!\r\n\r\nΣυναντηθηκα με το Γιωργο,  ο οποιος προσφερθηκε να κερασει καφεδακι και να τα πουμε λιγο πριν ξεκινησει να ασχολειται με το αυτοκινητο μου.\r\n\r\nΤου εξηγησα οτι ειχα καποια θεματακια που απο την αντιπροσωπεια δεν ειχαν βρει τη λυση  τους και μετα απο λιγο ο Γιωργος μου εδωσε τη λυση, την οποια εφαρμοσαμε και απο τοτε δεν εχω κανενα προβλημα!\r\n\r\nΜετα ξεκινησε η φαση του προγραμματισμου αλλα πριν απο αυτο μου ειπε αναλυτικα τι θα κανουμε, πως θα το κανουμε και γιατι και ουσιαστικα απαντησε σε οποιες ερωτησεις ειχα στο μυαλο μου χωρις καν να τις κανω!\r\n\r\nΑφου εγινε ο προγραμματισμος, βγηκαμε στο δρομο για δοκιμη, το αυτοκινητο πραγματικα αγνωριστο! Σαν να πηρα καινουργιο!\r\n\r\nΜου αρεσε πολυ η συμπεριφορα του, οι γνωσεις του και η προθυμια του να ασχοληθει με ενα αλλο προβλημα που ειχα χωρις να ειναι στις υποχρεωσεις του.\r\n\r\nΣιγουρα θα τον επισκεφθω ξανα για να κανουμε και αλλα ‘μαγικα’ στο αυτοκινητο!\r\n\r\nΕνας επαγγελματιας που ξερει και σεβεται το επαγγελμα του.",
    "author": "ammoulianiotis"
  },
  {
    "text": "Ο Γιώργος είναι εγγύηση. Σε εξυπηρετεί και με το παραπάνω, σου εξηγεί σου δίνει συμβουλές θα σου πει το καλύτερο για το αυτοκίνητο σου. Έμεινα απόλυτα ευχαριστήμενος και όχι μόνο εγώ αλλά και το αυτοκίνητο μου. Ευχαριστώ Γιώργο.",
    "author": "ΝΙΚΟΣ Γ."
  },
  {
    "text": "Τα παιδιά είναι πραγματικά επαγγελματίες, ευγενικοί στην ομιλία κ φαίνεται ότι ξέρουν τι λένε. Πέρασα πρόγραμμα στο αυτοκίνητο μου κ είμαι φουλ ευχαριστημένος, αρκετά μεγάλη διαφορά στη ροπή κ πολύ ωραία ρυθμισμένο.",
    "author": "Andrew C."
  },
  {
    "text": "Εξαιρετική δουλειά από έναν γνώστη του αντικειμένου.\r\nΕυχαριστώ Γιώργο!",
    "author": "James T."
  },
  {
    "text": "Hyundai i20 1.4 crdi\r\nΕξαιρετικός επαγγελματίας ο Γιώργος και πάνω απ όλα πολύ καλός άνθρωπος..!\r\nΜε βοήθησε εξ αρχής πάνω σε σοβαρό πρόβλημα που είχα με το αυτοκίνητο και η εδώ αντιπροσωπία δεν μπορούσε να δώσει λύση η καλύτερα δεν ήθελε να δώσει λύση όπως αποδείχτηκε στην πορεία..\r\nΚάναμε 2ο στάδιο, πραγματικά έχω άλλο αυτοκίνητο στα χέρια πλέον, πολύ δυνατό σε όλο το εύρος και η μέση κατανάλωση από 5.6 έχει πέσει στο 4.7..!\r\nΤου αξίζουν πολλά μπράβο και μακάρι να ήταν όλοι σαν κι αυτόν..!\r\nΠραγματικά σου εύχομαι τα καλύτερα από ψυχής αδερφε και συνέχισε ετσι.!",
    "author": "Αποστόλης Τ."
  },
  {
    "text": "Έβαλα πρόγραμμα στο αμάξι μου και έγινε άλλο αμάξι, απόλυτα ευχαριστημένος σε όλους τους τομείς. Ο Γιώργος πολύ κατατοπιστικός και ειλικρινής μου εξήγησε τα θετικά και τα αρνητικά του αυτοκινήτου μου και μου απάντησε σε κάθε απορία που είχα. Με κέρασε καφέ και μετά βγήκαμε έξω μαζί στον δρόμο για να δούμε το αμάξι και να κάνει τις απαραίτητες ρυθμίσεις. Τον συστήνω ανεπιφύλακτα, από τους επαγγελματίες του χώρου. Seat Leon FR 1.8 Tsi 180ps",
    "author": "Thanasis R."
  },
  {
    "text": "Άψογη εξυπηρέτηση και τηλεφωνικά και προσωπικά από κοντά, όλοι πρόθυμοι να βοηθήσουν και να εξυπηρετήσουν. Ο Γιώργος έχει πολλές γνώσεις πάνω στα αυτοκίνητα το καταλαβαίνεις κατευθείαν, πολύ καλή δουλειά το αυτοκίνητο μου έγινε πολύ διαφορετικό σε σχέση με πριν. Σας τον συνιστώ 100%",
    "author": "George T."
  },
  {
    "text": "Η δουλεια που κανουν τα παιδια ειναι πραγματικα φοβερη. Απιθανη αποδοση σε ολα τα αυτοκινητα που καναμε μεχρι τωρα. Μπραβο πραγματικα",
    "author": "Bamas C."
  },
  {
    "text": "Τα τελευταία χρόνια βιώνουμε όλο και περισσότερο την ασυνέπεια.Εαν λοιπον είστε απογοητευμένος ειδικά από τον κλάδο των προγραμματιστών ήρθε η ώρα να αποζημειωθειτε και ακούει στο όνομα Γιώργος.Αφεθειτε στα έμπειρα και ικανά χέρια του και πριν τελειώσετε τον καφέ σας,θα ζήσετε μια ευχάριστη έκπληξη.Απλα θα φύγετε με άλλο αυτοκίνητο.ΕΥΓΕ Γιώργη λέβεντη!!!!!!!! Υ/Γ Έχεις αλλάξει το τοπίο του χώρου σου...",
    "author": "Ntinos N."
  },
  {
    "text": "Πήγα στο Raceroms και έμεινα εντυπωσιασμένος από την επαγγελματική αντιμετώπιση στον πελάτη,  συνιστώ 100%!!! αν άλλαζα αμάξι θα το ξανά αναβάθμισα me Raceroms, Το αμάξι πάει σφαίρα!!!!",
    "author": "Dimos P."
  },
  {
    "text": "Απόλυτα ικανοποιημένος με το αποτέλεσμα. Ο Γιώργος γνώστης του αντικειμένου και όχι μόνο. Πολύ αξιόλογο άτομο, ο οποίος θα σου λύσει οποιαδήποτε απορία πάνω στο αντικείμενό του με ιδιαίτερη ευχαρίστηση. Θα σου πει αυτά που πρέπει να σου πει για το αυτοκίνητό σου και όχι αυτά που εσύ θα ήθελες να ακούσεις. Πάνω απ’ όλα Άνθρωπος. Προτείνεται ανεπιφύλακτα για οποιονδήποτε θα ήθελε να κάνει σωστή και μελετημένη αναβάθμιση στο αυτοκίνητό του!!!",
    "author": "John K."
  },
  {
    "text": "Άψογη εξυπηρέτηση, γρήγορη και καθαρή δουλειά! Επαγγελματίας με τα όλα του! Συνιστώ ανεπιφύλακτα",
    "author": "Avraam E."
  },
  {
    "text": "Άψογη εξυπηρέτηση, επαγγελματισμός, ο Γιώργος πάντα πρόθυμος να λύσει κάθε απορία με επιχειρήματα χωρίς να προσπαθεί να εντυπωσιάσει. Feed back συνεχώς μέχρι να βεβαιωθεί ότι όλα είναι άψογα.  Σου εμπνέει την εμπιστοσύνη από την πρώτη στιγμή με τις γνώσεις και διορατικότητα του. Η δική μου πρόταση:  Μπορείτε να βασισθείτε ότι θα δείτε στο αυτοκίνητο σας αυτό που ζητήσατε. Ευχαριστώ Γιώργο.",
    "author": "Αναστάσιος Σ."
  },
  {
    "text": "Hyundai i20 (2018) - 1.0 Turbo (Βενζίνη)\r\n\r\n106 Ίπποι ➡️ 153 Ίπποι\r\n176 ΝΜ Ροπής ➡️ 218 ΝΜ Ροπής\r\n\r\nΟ Γιώργος είναι εξαιρετικά καλός επαγγελματίας. Γνωρίζει καλά τη δουλειά του, έχει μεγάλη πείρα και ξέρει σε κάθε αυτοκίνητο τι προγραμματισμό είναι καλύτερο να επιλέξει.\r\nΚάναμε το 1ο στάδιο και από τη στιγμή που βγήκαμε για δυναμομέτρηση, το αμάξι ήταν τελείως διαφορετικό. Πιο πρόθυμο σε όλο το εύρος των στροφών, χωρίς σκαλοπάτια και με σαφώς μεγαλύτερη δύναμη στον κινητήρα. Πλέον κάθε διαδρομή είναι οδηγική απόλαυση!\r\nΘα τον συνιστούσα ανεπιφύλακτα.\r\nΕυχαριστώ φίλε και καλές δουλειές να έχεις πάντα!",
    "author": "Nektarios K."
  },
  {
    "text": "Παιδια με κλειστά μάτια Raceroms...το αμάξι πετάει δεν θα το μετανιώσετε,πολύ καλή εξυπηρέτηση με της κατάλληλες μετρήσεις για την απόδοση του αυτοκινήτου σας.",
    "author": "Nikos S."
  },
  {
    "text": "Stage 1 Επαγγελματική  δουλειά ! Ο Γιώργος εξαιρετικός προγραμματιστής, κατάφερε να μεταμορφώσει το αυτοκίνητο μέσα σε λίγη ώρα και μου έλυσε κάθε απορία που είχα. Συγχαρητήρια !",
    "author": "Gio K."
  },
  {
    "text": "Μετα απο ψάξιμο και συζήτηση με ανθρωπους του χώρου κατέληξα στον Γιωργο.\r\nΜια απόφαση που δικαιώθηκε στο100%.\r\nΕνα αυτοκίνητο \"πνιγμενο\" μεσα σε λιγες ωρες μεταμορφώθηκε σε ολο το φάσμα των στροφών τοσο σε ροπή οσο και σε δύναμη\r\nΕξαιρετικός επαγγελματίας αριστη συμπεριφορά  σε ενα οικογενειακο-φιλικο περιβάλλον..\r\nΣυνιστω την Racecorms ανεπιφύλακτα.\r\nΣυγχαρητήρια Γιωργο.",
    "author": "ΣΤΕΛΙΟΣ Ζ."
  },
  {
    "text": "Αψογος ο Γιωργος σε ολα! Το αμαξι βελτιωθηκε οπως επρεπε χωρις κανενα προβλημα. Πολυ γρηγορος και με σωστες γνωσεις. Ευχαριστω πολυ",
    "author": "Zack K."
  },
  {
    "text": "Είμαι αρκετά ευχαριστημένος από το πρόγραμμα. Το αυτοκίνητο έγινε πολύ δυνατό και η κατανάλωση έπεσε πάνω από μισό λίτρο. Ο Γιώργος ότι είπε το έκανε, ευχαριστώ πολύ.",
    "author": "zapras h."
  },
  {
    "text": "Ευχαριστώ τον Γιώργο για την άψογη δουλειά που  έκανε στο αυτοκίνητο μου και τη λεπτομέρεια στο tuning του. Μπορεί να παιδεύτηκα με άλλες εταιρίες και tuners αλλά άξιζε η τελική μου προσπάθεια.. Πάντα τέτοια!",
    "author": "Chris P."
  },
  {
    "text": "Άψογος, πολύ καλός στην δουλειά του, τον συστήνω ανεπιφύλακτα!!!",
    "author": "Killer B."
  },
  {
    "text": "Εμπιστευτείτε τον με κλειστά μάτια. Το αυτοκίνητο μου είχε πρόγραμμα (αγορά από Ιταλία) χωρίς να το γνωρίζω όταν το αγόρασα, αν και είχε αρκετή δύναμη ήθελα το κάτι παραπάνω και έτσι κατέληξα στην απόφαση να του βάλω πρόγραμμα, μετά από πολύ ψάξιμο κατέληξα να κλείσω ραντεβού στον Γιώργο. Από την πρώτη στιγμή κατάλαβε ότι κάτι δεν πάει καλά με το αυτοκίνητο και σε λίγη ώρα είχε βρεθεί το πρόβλημα ( υπήρχε προγραμματισμός πρώτου σταδίου αλλά με παλιό και παρωχημένο πρόγραμμα) Με ρώτησε τι ήθελα να κάνω (αν θα το άφηνα όπως ήταν η θα έβαζε το δικό του) και εφόσον ήξερα πως πηγαίνει το αυτοκίνητο είπα να δοκιμάσω το καινούριο του Γιώργου. Από εδώ καί πέρα ότι και να πω είναι λίγο, άλλαξε όλο το αυτοκίνητο έγινε πραγματικά γρήγορο και ανέλπιστα γραμμικό. Ευχαριστώ Γιώργο είσαι πραγματικός επαγγελματίας.",
    "author": "adam v."
  },
  {
    "text": "Ο Γιώργος είναι εξαιρετικός επαγγελματίας...Πρώτη φορά κάνω πρόγραμμα σε αυτοκίνητο είχα πολλές ερωτήσεις και ενδοιασμούς αλλά ο αδελφός και φίλος Γιώργος μου τα εξήγησε όλα ωραία και μου έδωσε να καταλάβω το τι θα έκανε όλα έγιναν όπως τα είπε το αμάξι δουλεύει τέλεια χωρίς κανένα απολύτως πρόβλημα.Γιώργο σε ευχαριστώ για όλα και το σίγουρο είναι αν αλλάξω αμάξι θα το κάνω και εκείνο πρόγραμμα μαζί σου...",
    "author": "Giwrgos z"
  },
  {
    "text": "Το αυτοκίνητο αποκτά την δύναμη που του έλειπε ... Ο Γιώργος ξέρει τι κάνει και σου εξηγεί τα πάντα !!",
    "author": "kostas m."
  },
  {
    "text": "Εξαιρετική δουλειά!\r\nΟ Γιώργος άψογος σε όλα!\r\nΕυχαριστώ",
    "author": "Γιω Ργος"
  },
  {
    "text": "Εξαιρετικές υπηρεσίες με τις καλύτερες τιμές της πόλης και εξαιρετική εμπειρία συνολικά.",
    "author": "Searievolk00"
  },
  {
    "text": "Είμαι πολύ ευχαριστημένος από το πρόγραμμα το αυτοκίνητο έγινε αρκετά δυνατό και ο κινητήρας έχει τέλεια λειτουργία και εννοείτε ο Γιώργος είναι πολύ καλός και εξηγημένος στην δουλειά του",
    "author": "mhtsos Ζ."
  },
  {
    "text": "Πρώτο στάδιο σε Renault Captur εδώ και ένα μήνα, μετά από 3.000 χλμ είναι άλλο αυτοκίνητο, πολύ πιο ζωηρό και γρήγορο. Πολύ καλή δουλειά.",
    "author": "Αλέξ Ι."
  },
  {
    "text": "Το γεγονός ότι είχα ραντεβού και όλα έγιναν στην ώρα τους με εξέπληξαν. Ο Γιώργος μου εξήγησε ακριβώς τι θα γίνει και έγινε. Το αυτοκίνητο άλλαξε σαν να οδηγάω άλλο. Σε ευχαριστώ για όλα φίλε Γιώργο, τον συστήνω ανεπιφύλακτα!!",
    "author": "χρηστος μ."
  },
  {
    "text": "Πολύ φιλόξενος και ζεστός άνθρωπος ο Γιώργος . Πρόθυμος να σου λύσει και να συζητήσετε οποιαδήποτε απορία έχεις πάνω στο αυτοκίνητου σου.\r\nΤο πρόγραμμα λειτουργεί άψογα έχοντας πάντα σαν βάση την ασφάλεια του κινητήρα. Σου ζωντανεύει το αμάξι και σου δίνει νεύρο που ίσως δεν περίμενες . Ευχαριστημένος 100%\r\nΣε ευχαριστώ πολύ Γιώργο!\r\n(FORD FIESTA 2014)",
    "author": "Nick F."
  },
  {
    "text": "Θα έπρεπε να υπάρχουν παραπάνω αστέρια για τέτοιες περιπτώσεις!! Όλα τέλεια, άλλο αυτοκίνητο από ιπποδύναμη και οικονομία!! Τέλεια εξυπηρέτηση από τον Γιώργο. Συστήνω ανεπιφύλακτα",
    "author": "George T."
  },
  {
    "text": "Άψογος επαγγελματίας, φοβερή δουλειά, φανταστικά αποτελέσματα! Κάναμε 1 αυτοκινητο στην αρχή, και τελικά τον επισκέφτηκε όλη η οικογένεια. Πραγματικά ότι καλύτερο κυκλοφορεί στον κλάδο του προγραμματισμού! Γιώργο σε ευχαριστούμε!",
    "author": "Ευάγγελος Μ."
  },
  {
    "text": "Φανταστικός ο Γιώργος σαν γνωστης και σαν άνθρωπος, φανταστικό και το αποτέλεσμα!  Τον συστήνω ανεπιφύλακτα!",
    "author": "Γεωργιος Μ."
  },
  {
    "text": "Αμεση εξυπηρετηση συζητηση και επαφη σχετικα με το θεμα της βελτιωσης του BMW 520d 177hp.\r\nΤο αποτελεσμα της αναβαθμισης εντυπωσιακο. Η καταναλωση καυσιμου μειωθηκε αισθητα !!",
    "author": "Kostas M."
  },
  {
    "text": "Πολυ δυνατος , αλλο αμάξι οδηγησα...",
    "author": "Anestis A."
  },
  {
    "text": "Αψογος επαγγελματιας παραδειγμα προς μιμηση",
    "author": "ElNino10"
  },
  {
    "text": "Scirocco 1.4 160ps , το αμάξι πετάει! Απλά πάρα πολύ εξυπηρετικός ο Γιώργος, και αυτο που με κέρδισε είναι η τεχνογνωσία που έχει στο αντικείμενο. Το αμάξι έχει γίνει πολύ δυνατό, και η γραμμικότητα του είναι απίστευτη! Σε ευχαριστώ!!",
    "author": "No Limits"
  },
  {
    "text": "Έκανα το Α200 μου στα παιδιά και το αυτοκίνητο μου έγινε άλλο. Δεν το περίμενα πραγματικά. Επαγγελματίες, όλα στην ώρα τους και με απόλυτα σωστό τρόπο. Μακάρι όλοι να ήταν έτσι. Ευγε!",
    "author": "Giannis M."
  },
  {
    "text": "Ford Focus 2013 ecoboost πήρε επιτέλους ανάσα. Ευχαριστώ την Raceroms και το ειδικά το Γιώργο για την δουλειά τους.",
    "author": "Βαγγέλης Ε."
  },
  {
    "text": "Πρώτα θα μιλήσω για τον Γιώργο και μετά για το αμάξι..... Έχουμε και λέμε ο Γιώργος είναι τρομερός επαγγελματίας στη δουλειά του που σου δείχνει από τη πρώτη στιγμή την σιγουριά του σε αυτό που κάνει και πάντα πρόθυμος οποιαδήποτε στιγμή να απαντήσει σε κάθε ερώτημασας...... Το αμάξι μ το. Audi a1 90hp με το πρόγραμμα δεν περίμενα ότι αυτό το αυτοκίνητο κάποια στιγμή θα πήγαινε έτσι έμεινα έκπληκτος 147 HP πήγε και τώρα έγινε αμάξι επιτέλους και μπορώ να κάνω μια προσπέραση",
    "author": "Nikos K."
  },
  {
    "text": "Ο Γιώργος κάνει ότι καλύτερο μπορεί και σε πολύ σύντομο χρονικό διάστημα έχεις στα χέρια σού ένα άλλο αυτοκίνητο. Σας τον προτείνω με κλειστά μάτια.",
    "author": "Panos M."
  },
  {
    "text": "Κάτοχος  Renault clio 1,5 cdi sw 2015\r\nΑριστη εξυπηρέτηση , άμεση ανταπόκριση υπέρ οικανοποιητικό το αποτέλεσμα .\r\nΣυνηστάτε ανεπιφύλακτα !!\r\nΠρόταση , να να μην επεμβένετε στη δουλειά του , εκείνος ξέρει να σας προτείνει το καλύτερο στάδιο για το όχημά σας .",
    "author": "kostas s."
  },
  {
    "text": "Αρχικά, ο Γιώργος μου ενέπνευσε εμπιστοσύνη τόσο από το τηλέφωνο όσο κι από κοντά.\r\nΣτη συνέχεια, παρατηρώντας πόσο άνετα και μεθοδικά κάνει τη δουλειά του, ήμουν πλέον σίγουρος για την επιλογή μου.\r\n\r\nΑξίζει να τονίσω ότι:\r\n1. Πριν τον προγραμματισμό, έλεγξε την \"υγεία\" του αυτοκινήτου, εντοπίζοντας μια σημαντική βλάβη (την οποία αποκατέστησα, λίγους μήνες πριν τη λήξη της εγγύησης της αντιπροσωπείας)\r\n2. Κατάφερε να προγραμματίσει μια δύσκολη ecu και μάλιστα χωρίς να την ανοίξει, ούτε καν να την αφαιρέσει. (Αυτό γίνεται στο δικό μου)\r\n3. Τα πράγματα έγιναν ακριβώς όπως τα περίγραψε. Το αυτοκίνητο γίνεται πιο δυνατό όσο γράφει km και μαθαίνει η ecu.\r\nToyota Corolla 1.4 d4d nde180_2016 euro 6",
    "author": "Δρόσος Λ."
  },
  {
    "text": "Excellent service, logical and fair prices",
    "author": "Nikos K."
  },
  {
    "text": "Kia Sportage crdi 1.7\r\nΣτο αμάξι φάνηκε η διαφορά απτά πρώτα μέτρα που έκανα.Στον ανοιχτό δρόμο η συμπεριφορά του πλέον είναι σαν βενζινοκίνητο,τελείως διαφορετικό αμάξι.ο Γιώργος που έκανε την βελτίωση εξηγεί τα πάντα με λεπτομέρειες οπότε δεν χρειάστηκε να ρωτήσω κάτι.100% ευχαριστημένος.",
    "author": "Paris V."
  },
  {
    "text": "Professional, knowledgeable and friendly. Got my BMW tuned and completely transformed the car. Highly recommended.",
    "author": "Harry A."
  }
];

export const faqs: Faq[] = [
  {
    "question": "Τι είναι το ECU remapping, και πως λειτουργεί ;",
    "answer": "<p>Στον κόσμο της σύγχρονης βελτίωσης αυτοκινήτων, η μέγιστη αξιοποίηση του κινητήρα σας απαιτεί ακρίβεια και εξειδίκευση. Όλα τα μοντέρνα αυτοκίνητα είναι εξοπλισμένα με μια ECU (Υπολογιστική Μονάδα) ή PCM (Μονάδα Ελέγχου Κινητήρα), βασικά στοιχεία που ρυθμίζουν διάφορες λειτουργίες του κινητήρα. Αυτές οι μονάδες ελέγχουν μια σειρά από αισθητήρες που διαχειρίζονται σημαντικές παραμέτρους, όπως το μείγμα καυσίμου-αέρα, την έκχυση καυσίμου και τη συνολική απόδοση του κινητήρα.</p>\n\n<p> </p>\n\n<p>Στα καταστηματά μας, ειδικευόμαστε στην ακριβή τροποποίηση των δεδομένων αυτών των μονάδων για να βελτιώσουμε την απόδοση του οχήματός σας. Με τη ρύθμιση της ECU ή του PCM, μπορούμε να βελτιστοποιήσουμε την αποδοτικότητα του κινητήρα, προσφέροντας αυξημένη ισχύ, καλύτερη οικονομία καυσίμου και μια πιο άμεση απόκριση κατά την οδήγηση.</p>"
  },
  {
    "question": "Το αυτοκίνητο μου βρίσκεται ακόμα σε εργοστασιακή εγγύηση, τι μπορώ να κάνω;",
    "answer": "<p>Ο προγραμματισμός του εγκεφάλου σας που προσφέρουμε γίνονται με ακριβά και υψηλής τεχνολογίας εργαλεία, κάνοντας τη διαδικασία να φαίνεται εύκολη.</p>\n\n<p> </p>\n\n<p>Ο προγραμματισμός του εγκεφάλου σας δεν θα τον καταστρέψει, αλλά ας είμαστε ειλικρινείς, αν ο κατασκευαστής του αυτοκινήτου θέλει να δει αν ο εγκέφαλος έχει τροποποιηθεί, μπορεί να το διαπιστώσει και να ακυρώσει την εγγύηση.</p>\n\n<p> </p>\n\n<p>Η απόφαση να τιμήσει την εγγύηση εναπόκειται στον κατασκευαστή αν προκύψει κάποιο πρόβλημα.</p>"
  },
  {
    "question": "Θα αλλάξω κατηγορία καυσαερίων με την αυξημένη ιπποδύναμη;",
    "answer": "<p>Όχι, αν και εφόσον δεν πειράξουμε τη χωρητικότητα του κινητήρα καθώς και τον εργοστασιακό καταλύτη.</p>"
  },
  {
    "question": "Πόση ώρα διαρκεί η εγκατάσταση του λογισμικού σας;",
    "answer": "<p>Η διαδικασία ρύθμισης της ECU συνήθως διαρκεί περίπου 2-3 ώρες, συμπεριλαμβανομένης της ενδελεχούς δυναμομέτρησης. Ακολουθεί μια λεπτομερής περιγραφή του τι να περιμένετε όταν επιλέγετε τις επαγγελματικές μας υπηρεσίες βελτίωσης αυτοκινήτων:</p>\n\n<p> </p>\n\n<h3>Αποτελεσματική και Ακριβής Ρύθμιση ECU</h3>\n\n<p> </p>\n\n<ol>\n\t<li>\n\t<p><strong>Δοκιμή στο δυναμόμετρο υπό Πραγματικές Συνθήκες</strong>: Μετά τη δημιουργία της προσαρμοσμένης ρύθμισης, δοκιμάζουμε το αυτοκίνητο στο δυναμόμετρο υπό πραγματικές συνθήκες για να δούμε πώς αποδίδει. Αυτό διασφαλίζει ότι η ρύθμιση της ECU είναι αποτελεσματική στις καθημερινές συνθήκες οδήγησης.<br />\n\t </p>\n\t</li>\n\t<li>\n\t<p><strong>Ανάλυση με Προηγμένο Δυναμόμετρο </strong>: Το ειδικά καλιμπραρισμένο δυναμόμετρο μας μετρά την απόδοση του αυτοκινήτου υπό τις συνθήκες της συγκεκριμένης ημέρας. Αυτό το εργαλείο παρέχει λεπτομερή εκτυπώσιμα δεδομένα απόδοσης του αυτοκινήτου, τα οποία μπορούν να διατεθούν στον πελάτη. </p>\n\t</li>\n</ol>"
  },
  {
    "question": "Πουλάτε προγράμματα «κονσέρβα» ;",
    "answer": "<p>Όχι, επεξεργαζόμαστε το αρχείο από τον εγκέφαλο σας για να διασφαλίσουμε ότι το αυτοκίνητο θα λειτουργεί άψογα μετά την επαναπρογραμματισμένη ρύθμιση.</p>\n\n<p> </p>\n\n<p>Αν ο οδηγός θέλει να ενημερώσει τη μονάδα, μπορεί να το κάνει, αλλά θα πρέπει να ξανακάνουμε την αρχική ρύθμιση στο ECU.</p>\n\n<p> </p>\n\n<p><strong>Γιατί να Επιλέξετε τις Υπηρεσίες Ρύθμισης ECU μας;</strong></p>\n\n<p><br />\nΑκρίβεια και Αξιοπιστία: Επεξεργαζόμαστε το αρχείο από την ECU σας με στόχο την ακριβή και αξιόπιστη απόδοση μετά την επαναπρογραμματισμένη ρύθμιση.<br />\n<br />\nΕνημερώσεις Μονάδας: Εάν χρειαστεί να ενημερώσετε τη μονάδα, μπορούμε να επαναλάβουμε την αρχική ρύθμιση για να διασφαλίσουμε ότι η απόδοση του αυτοκινήτου παραμένει βέλτιστη.</p>"
  },
  {
    "question": "Τι κερδίζω με τον προγραμματισμό;",
    "answer": "<p>Για αρχή, η αναβάθμιση της απόδοσης του αυτοκινήτου σας με επαγγελματική ρύθμιση φέρνει περισσότερα χαμόγελα κάθε φορά που οδηγείτε. Η αυξημένη ισχύς δεν αφορά μόνο την ταχύτερη επιτάχυνση από 0-100, αλλά και την βελτιωμένη ασφάλεια κατά την προσπέραση.<br />\n<br />\nΜε την βελτιστοποίηση του λόγου καυσίμου-αέρα, όχι μόνο επιτυγχάνετε καλύτερη οικονομία καυσίμου αλλά και αυξάνετε τη συνολική αποδοτικότητα του οχήματος. Είναι μια κατάσταση κερδοφόρα για όλους.</p>\n\n<h3> </h3>\n\n<h3><strong>Οφέλη της Επαγγελματικής Ρύθμισης Αυτοκινήτου</strong></h3>\n\n<p> </p>\n\n<ul>\n\t<li><strong>Αυξημένη Ευχαρίστηση Οδήγησης</strong>: Απολαύστε περισσότερη χαρά και ενθουσιασμό με κάθε διαδρομή χάρη στην αυξημένη ισχύ και απόκριση.</li>\n\t<li> </li>\n\t<li><strong>Βελτιωμένη Ασφάλεια Προσπέρασης</strong>: Με την αναβαθμισμένη ισχύ, οι προσπεράσεις γίνονται ασφαλέστερες και πιο αποδοτικές, προσφέροντάς σας ηρεμία στον δρόμο.</li>\n\t<li> </li>\n\t<li><strong>Βελτιστοποιημένος Λόγος Καυσίμου-Αέρα</strong>: Επιτύχετε καλύτερη οικονομία καυσίμου με τη βελτιστοποίηση του μείγματος καυσίμου-αέρα, οδηγώντας σε εξοικονόμηση κόστους και λιγότερες στάσεις στο βενζινάδικο.</li>\n\t<li> </li>\n\t<li><strong>Αυξημένη Αποδοτικότητα Οχήματος</strong>: Η συνολική απόδοση του οχήματος βελτιώνεται, καθιστώντας το αυτοκίνητό σας πιο αποδοτικό και αξιόπιστο.</li>\n</ul>"
  },
  {
    "question": "Μπορει το όχημα μου να πάθει ζημιά απο τον προγραμματισμό;",
    "answer": "<p>Οι ρυθμίσεις ECU Stage 1 που προσφέρουμε είναι σχεδιασμένες με ασφάλεια και αξιοπιστία, διασφαλίζοντας ότι το αυτοκίνητό σας παραμένει σε άριστη κατάσταση. Μπορούμε να σας διαβεβαιώσουμε ότι οι ρυθμίσεις μας δεν θα προκαλέσουν ζημιά στο όχημά σας.<br />\n </p>\n\n<p>Στόχος μας είναι να δημιουργούμε ασφαλείς και αποτελεσματικές ρυθμίσεις ECU, ώστε να απολαμβάνετε βελτιωμένη απόδοση χωρίς να προκαλείται υπερβολική φθορά στον κινητήρα.</p>\n\n<p> </p>\n\n<h3>Οφέλη των προγραμματισμών Stage 1 μας.</h3>\n\n<p> </p>\n\n<ul>\n\t<li><strong>Ασφάλεια Πρώτα</strong>: Οι ρυθμίσεις Stage 1 είναι προσεκτικά σχεδιασμένες για να είναι απολύτως ασφαλείς για το αυτοκίνητό σας, προσφέροντας σας ηρεμία ότι ο κινητήρας σας δεν θα υποστεί βλάβη.</li>\n\t<li> </li>\n\t<li><strong>Μακροζωία Κινητήρα</strong>: Δίνουμε προτεραιότητα στη δημιουργία ρυθμίσεων που διατηρούν την υγεία και τη μακροζωία του κινητήρα σας, εξασφαλίζοντας ότι μπορείτε να χρησιμοποιείτε το αυτοκίνητό σας όσο χρειάζεται χωρίς πρόσθετη καταπόνηση.</li>\n\t<li> </li>\n\t<li><strong>Βελτιστοποιημένη Απόδοση</strong>: Απολαύστε αισθητές βελτιώσεις στην ισχύ, τη ροπή και την οικονομία καυσίμου με τις επαγγελματικούς προγραμματισμούς Stage 1 μας.</li>\n</ul>"
  },
  {
    "question": "Τι γίνεται αν το όχημα αναβαθμιστεί από την αντιπροσωπεία ?",
    "answer": "<p>Μερικές φορές, οι αντιπροσωπείες πραγματοποιούν ενημερώσεις σε διάφορες μονάδες του αυτοκινήτου σας κατά τη διάρκεια προγραμματισμένων διαστημάτων συντήρησης. Αν αυτό συμβεί, η ρύθμιση ECU μας μπορεί να αντικατασταθεί.</p>\n\n<p> </p>\n\n<p>Ωστόσο, δεν χρειάζεται να ανησυχείτε. Μπορούμε να αναλάβουμε ξανα τον προγραμματισμό του οχήματος σας εκ νέου. Σε αυτό το σημείο να προσθέσουμε οτι δεν μπορούμε να χρησιμοποιήσουμε αρχείο απο τον προηγούμενο προγραμματισμό σας, καθώς δεν ειναι πλέον συμβατό με το αυτοκίνητο σας, αλλά πρέπει να γίνει εκ νέου με νέα χρεώση. </p>\n\n<p> </p>\n\n<h3><strong>Γιατί να Επιλέξετε τις Υπηρεσίες Ρύθμισης Αυτοκινήτου μας;</strong></h3>\n\n<p> </p>\n\n<ul>\n\t<li><strong>Εξειδικευμένος Επαναπρογραμματισμός ECU</strong>: Οι επαγγελματικές υπηρεσίες ρύθμισης ECU μας εξασφαλίζουν ότι η απόδοση του αυτοκινήτου σας είναι πάντα στο καλύτερο επίπεδο, ακόμα και μετά από ενημερώσεις της αντιπροσωπείας.</li>\n\t<li> </li>\n\t<li><strong>Χωρίς Άγχος</strong>: Αν μια ενημέρωση από την αντιπροσωπεία αντικαταστήσει τη ρύθμισή μας, μπορούμε να προγραμματίσουμε ξανα με επιπλέον κόστος, διασφαλίζοντας ότι το όχημά σας διατηρεί την βελτιωμένη απόδοσή του.</li>\n\t<li> </li>\n\t<li><strong>Βελτιστοποιημένη Απόδοση</strong>: Οι ρυθμίσεις ECU μας βελτιστοποιούν την ισχύ, τη ροπή και την οικονομία καυσίμου του αυτοκινήτου σας, παρέχοντάς σας μια ανώτερη οδηγική εμπειρία.</li>\n</ul>"
  },
  {
    "question": "Προσφέρετε καποια εγγύηση;",
    "answer": "<ul><li><strong>Εγγύηση Καλής Λειτουργίας</strong>: Υποστηρίζουμε την ποιότητα του λογισμικού μας με μια ολοκληρωμένη εγγύηση. Μπορείτε να είστε βέβαιοι ότι οι ρυθμίσεις ECU μας έχουν σχεδιαστεί για αξιόπιστη απόδοση και αντοχή.</li><li> </li><li><strong>Δυναμομέτρηση με Ανάλυση Δεδομένων</strong>: Για να διασφαλίσουμε την καλύτερη δυνατή ρύθμιση, πραγματοποιούμε δυναμομετρήσεις συνοδευόμενες από ανάλυση δεδομένων. Αυτή η διαδικασία μας επιτρέπει να βελτιστοποιούμε την ρύθμιση του ECU με βάση τα πραγματικά δεδομένα λειτουργίας του κινητήρα.</li><li> </li><li><strong>Υψηλής Ποιότητας Ρυθμίσεις ECU</strong>: Οι υπηρεσίες ρύθμισης ECU που παρέχουμε είναι κορυφαίας ποιότητας. Καλιμπράρουμε προσεκτικά το λογισμικό μας για να ευθυγραμμιστεί με τις συγκεκριμένες παραμέτρους του κινητήρα του οχήματός σας, βελτιώνοντας την ισχύ, τη ροπή και τη συνολική αποδοτικότητα.</li><li> </li><li><strong>Εγγύηση Επιστροφής Χρημάτων</strong>: Η ικανοποίηση των πελατών μας είναι προτεραιότητά μας. Αν δεν είστε απόλυτα ικανοποιημένοι με τη ρύθμιση του ECU, προσφέρουμε πλήρη επιστροφή χρημάτων για 14 ημέρες μετά την υπηρεσία, και αν παρουσιαστεί κάποιο πρόβλημα με τον προγραμματισμό σας, παρέχοντάς σας ηρεμία και εμπιστοσύνη στις υπηρεσίες μας.</li></ul>"
  }
];

export const stores: Store[] = [
  {
    "title": "Θεσσαλονίκη",
    "openTimes": "<p>Δευτέρα - Παρασκευή<br />\n10:30 - 18:30<br />\nΣάββατο<br />\n09:00 - 15:00 </p>",
    "email": "info@raceroms.com",
    "location": "https://maps.app.goo.gl/qZGmgx3kQYw3yuAM6?g_st=com.google.maps.preview.copy",
    "phones": [
      "+30 2311 11 2990"
    ]
  },
  {
    "title": "Αθήνα",
    "openTimes": "<p>Δευτέρα - Παρασκευή<br />\n10:30 - 18:30<br />\nΣάββατο<br />\n09:00 - 15:00</p>",
    "email": "athens@raceroms.com",
    "location": "https://www.google.com/maps/place/Kleisthenous+138,+Gerakas+153+43/@38.0214913,23.8449261,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1996591a0689f:0xa92fe6ea9815bd69!8m2!3d38.0214871!4d23.847501!16s%2Fg%2F11kmcly94_?entry=ttu",
    "phones": [
      "+30 211 4233 343"
    ]
  },
  {
    "title": "Ιωαννινα",
    "openTimes": "<p>Δευτέρα - Παρασκευή<br> 10:00 - 18:30<br> Σάββατο<br> 10:00 - 15:00 </p>",
    "email": "ioannina@raceroms.com",
    "location": "https://www.google.com/maps/place/Raceroms/@39.6098591,20.8593306,17z/data=!3m1!4b1!4m6!3m5!1s0x135be9a0afd1eba9:0xe1c2a758cb3bdc0f!8m2!3d39.6098591!4d20.8619055!16s%2Fg%2F11z2x1mcdp?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
    "phones": [
      "+30 2651 091624",
      "+30 694 223 4135"
    ]
  },
  {
    "title": "Ρόδος",
    "openTimes": "<p>Δευτέρα - Παρασκευή<br />\n10:30 - 18:30<br />\nΣάββατο<br />\n09:00 - 15:00</p>",
    "email": "rhodes@raceroms.com",
    "location": "https://www.google.com/maps/place/Raceroms/@36.3826541,28.196255,17z/data=!3m1!4b1!4m6!3m5!1s0x14956500488796e9:0xd3564e9eaf472042!8m2!3d36.3826498!4d28.1988299!16s%2Fg%2F11y49mtr21?entry=ttu",
    "phones": [
      "+30 6976 762533"
    ]
  },
  {
    "title": "On The Go",
    "openTimes": "<p>Καλέστε για ραντεβού.</p>\n\n<p> </p>\n\n<p> </p>",
    "email": "del@raceroms.com",
    "location": "https://www.google.com/maps/place/Raceroms+on+The+Go/@40.3079048,21.8099349,17z/data=!3m1!4b1!4m6!3m5!1s0x14a83fa68ef66633:0x9c857f1d120b16f!8m2!3d40.3079048!4d21.8125098!16s%2Fg%2F11r6c5vhmk?entry=ttu",
    "phones": [
      "+30 698 6816 636"
    ]
  }
];
