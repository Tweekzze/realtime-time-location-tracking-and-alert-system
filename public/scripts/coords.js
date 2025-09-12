
// Creating coordinates for drawing boundary layer for University of Engineering and Management National Park
// UEM Kolkata exact coordinates: 22.560029, 88.489782 (University Area, Plot No. III – B/5, New Town, Action Area – III, Kolkata)
const coordinates = [
    [22.5620, 88.4878],
    [22.5630, 88.4888],
    [22.5640, 88.4898],
    [22.5650, 88.4908],
    [22.5660, 88.4918],
    [22.5670, 88.4928],
    [22.5680, 88.4938],
    [22.5690, 88.4948],
    [22.5700, 88.4958],
    [22.5710, 88.4968],
    [22.5720, 88.4978],
    [22.5730, 88.4988],
    [22.5740, 88.4998],
    [22.5750, 88.5008],
    [22.5740, 88.5018],
    [22.5730, 88.5028],
    [22.5720, 88.5038],
    [22.5710, 88.5048],
    [22.5700, 88.5058],
    [22.5690, 88.5068],
    [22.5680, 88.5078],
    [22.5670, 88.5088],
    [22.5660, 88.5098],
    [22.5650, 88.5108],
    [22.5640, 88.5118],
    [22.5630, 88.5128],
    [22.5620, 88.5138],
    [22.5610, 88.5128],
    [22.5600, 88.5118],
    [22.5590, 88.5108],
    [22.5580, 88.5098],
    [22.5570, 88.5088],
    [22.5560, 88.5078],
    [22.5550, 88.5068],
    [22.5540, 88.5058],
    [22.5530, 88.5048],
    [22.5520, 88.5038],
    [22.5510, 88.5028],
    [22.5500, 88.5018],
    [22.5490, 88.5008],
    [22.5500, 88.4998],
    [22.5510, 88.4988],
    [22.5520, 88.4978],
    [22.5530, 88.4968],
    [22.5540, 88.4958],
    [22.5550, 88.4948],
    [22.5560, 88.4938],
    [22.5570, 88.4928],
    [22.5580, 88.4918],
    [22.5590, 88.4908],
    [22.5600, 88.4898],
    [22.5610, 88.4888],
    [22.5620, 88.4878]
];

// Wildlife sanctuary zone within the park (centered around UEM coordinates)
const wildlifeZone = [
    [22.5620, 88.4918],
    [22.5640, 88.4928],
    [22.5660, 88.4938],
    [22.5680, 88.4948],
    [22.5700, 88.4958],
    [22.5720, 88.4968],
    [22.5740, 88.4978],
    [22.5760, 88.4988],
    [22.5780, 88.4998],
    [22.5770, 88.5008],
    [22.5750, 88.5018],
    [22.5730, 88.5028],
    [22.5710, 88.5038],
    [22.5690, 88.5048],
    [22.5670, 88.5058],
    [22.5650, 88.5068],
    [22.5630, 88.5078],
    [22.5610, 88.5068],
    [22.5590, 88.5058],
    [22.5570, 88.5048],
    [22.5550, 88.5038],
    [22.5530, 88.5028],
    [22.5510, 88.5018],
    [22.5490, 88.5008],
    [22.5500, 88.4998],
    [22.5520, 88.4988],
    [22.5540, 88.4978],
    [22.5560, 88.4968],
    [22.5580, 88.4958],
    [22.5600, 88.4948],
    [22.5620, 88.4938],
    [22.5620, 88.4928],
    [22.5620, 88.4918]
];

// Visitor center and facilities (near the main UEM center point)
const visitorCenter = [
    [22.5580, 88.4878],
    [22.5590, 88.4888],
    [22.5600, 88.4898],
    [22.5610, 88.4908],
    [22.5600, 88.4918],
    [22.5590, 88.4928],
    [22.5580, 88.4938],
    [22.5570, 88.4928],
    [22.5560, 88.4918],
    [22.5550, 88.4908],
    [22.5560, 88.4898],
    [22.5570, 88.4888],
    [22.5580, 88.4878]
];

let recomendData = [
    {
        placeName: 'University of Engineering and Management Wildlife Observatory',
        desc: 'Main observation deck with panoramic views',
        latlon: [22.560029, 88.489782],
        img: 'https://i.postimg.cc/FK6xb1jv/Screenshot-2024-01-19-113738.png',
    },
    {
        placeName: 'Nature Trail Starting Point',
        desc: 'Begin your wildlife adventure here',
        latlon: [22.5580, 88.4958],
        img: 'https://i.postimg.cc/HxLtXXJB/Screenshot-2024-01-19-113540.png'
    },
    {
        placeName: 'Visitor Information Center',
        desc: 'Park maps, guides and safety information',
        latlon: [22.5590, 88.4908],
        img: 'https://i.postimg.cc/HxLtXXJB/Screenshot-2024-01-19-113540.png'
    }
]

// Animal simulation data - 10 diverse species for comprehensive wildlife tracking
const animals = {
    tiger: {
        id: 'tiger_1',
        name: 'Raja',
        type: 'tiger',
        icon: '🐅',
        scientificName: 'Panthera tigris',
        currentPos: [22.5620, 88.4918],
        territory: [
            [22.5610, 88.4908],
            [22.5630, 88.4918],
            [22.5640, 88.4928],
            [22.5630, 88.4938],
            [22.5610, 88.4928],
            [22.5600, 88.4918]
        ],
        speed: 0.00015, // Increased speed for hunting
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 50,
        warningRadius: 100,
        threatLevel: 'HIGH',
        habitat: 'Dense forest areas'
    },
    elephant: {
        id: 'elephant_1',
        name: 'Ganesha',
        type: 'elephant',
        icon: '🐘',
        scientificName: 'Elephas maximus',
        currentPos: [22.5580, 88.4938],
        territory: [
            [22.5570, 88.4928],
            [22.5590, 88.4938],
            [22.5600, 88.4948],
            [22.5590, 88.4958],
            [22.5570, 88.4948],
            [22.5560, 88.4938],
            [22.5550, 88.4928],
            [22.5560, 88.4918]
        ],
        speed: 0.00008,
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 30,
        warningRadius: 75,
        threatLevel: 'HIGH',
        habitat: 'Open grasslands and water sources'
    },
    leopard: {
        id: 'leopard_1',
        name: 'Shera',
        type: 'leopard',
        icon: '🐆',
        scientificName: 'Panthera pardus',
        currentPos: [22.5640, 88.4968],
        territory: [
            [22.5630, 88.4958],
            [22.5650, 88.4968],
            [22.5660, 88.4978],
            [22.5650, 88.4988],
            [22.5630, 88.4978],
            [22.5620, 88.4968],
            [22.5610, 88.4958],
            [22.5620, 88.4948]
        ],
        speed: 0.00018, // Increased speed for hunting
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 40,
        warningRadius: 80,
        threatLevel: 'HIGH',
        habitat: 'Rocky outcrops and dense vegetation'
    },
    slothBear: {
        id: 'bear_1',
        name: 'Baloo',
        type: 'slothBear',
        icon: '🐻',
        scientificName: 'Melursus ursinus',
        currentPos: [22.5540, 88.4958],
        territory: [
            [22.5530, 88.4948],
            [22.5550, 88.4958],
            [22.5560, 88.4968],
            [22.5550, 88.4978],
            [22.5530, 88.4968],
            [22.5520, 88.4958]
        ],
        speed: 0.00012, // Increased speed for hunting
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 35,
        warningRadius: 70,
        threatLevel: 'MEDIUM',
        habitat: 'Forest undergrowth and termite mounds'
    },
    spottedDeer: {
        id: 'deer_1',
        name: 'Bambi',
        type: 'spottedDeer',
        icon: '🦌',
        scientificName: 'Axis axis',
        currentPos: [22.5600, 88.4928],
        territory: [
            [22.5590, 88.4918],
            [22.5610, 88.4928],
            [22.5620, 88.4938],
            [22.5610, 88.4948],
            [22.5590, 88.4938],
            [22.5580, 88.4928]
        ],
        speed: 0.00015,
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 0,
        warningRadius: 20,
        threatLevel: 'NONE',
        habitat: 'Open meadows and forest edges'
    },
    peacock: {
        id: 'peacock_1',
        name: 'Mayur',
        type: 'peacock',
        icon: '🦚',
        scientificName: 'Pavo cristatus',
        currentPos: [22.5660, 88.4928],
        territory: [
            [22.5650, 88.4918],
            [22.5670, 88.4928],
            [22.5680, 88.4938],
            [22.5670, 88.4948],
            [22.5650, 88.4938],
            [22.5640, 88.4928]
        ],
        speed: 0.00011,
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 0,
        warningRadius: 15,
        threatLevel: 'NONE',
        habitat: 'Forest clearings and open areas'
    },
    rhinoHornbill: {
        id: 'hornbill_1',
        name: 'Zazu',
        type: 'rhinoHornbill',
        icon: '🦜',
        scientificName: 'Buceros rhinoceros',
        currentPos: [22.5680, 88.4948],
        territory: [
            [22.5670, 88.4938],
            [22.5690, 88.4948],
            [22.5700, 88.4958],
            [22.5690, 88.4968],
            [22.5670, 88.4958],
            [22.5660, 88.4948]
        ],
        speed: 0.00013,
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 0,
        warningRadius: 10,
        threatLevel: 'NONE',
        habitat: 'Tall forest canopy'
    },
    rhesusMonkey: {
        id: 'monkey_1',
        name: 'Hanuman',
        type: 'rhesusMonkey',
        icon: '🐒',
        scientificName: 'Macaca mulatta',
        currentPos: [22.5570, 88.4988],
        territory: [
            [22.5560, 88.4978],
            [22.5580, 88.4988],
            [22.5590, 88.4998],
            [22.5580, 88.5008],
            [22.5560, 88.4998],
            [22.5550, 88.4988]
        ],
        speed: 0.00016, // Increased speed for curious movement
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 5,
        warningRadius: 25,
        threatLevel: 'LOW',
        habitat: 'Tree canopies and rocky areas'
    },
    muggerCrocodile: {
        id: 'crocodile_1',
        name: 'Sobek',
        type: 'muggerCrocodile',
        icon: '🐊',
        scientificName: 'Crocodylus palustris',
        currentPos: [22.5630, 88.5038],
        territory: [
            [22.5620, 88.5028],
            [22.5640, 88.5038],
            [22.5650, 88.5048],
            [22.5640, 88.5058],
            [22.5620, 88.5048],
            [22.5610, 88.5038]
        ],
        speed: 0.00006,
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 45,
        warningRadius: 85,
        threatLevel: 'HIGH',
        habitat: 'Water bodies and wetlands'
    },
    wildBoar: {
        id: 'boar_1',
        name: 'Pumba',
        type: 'wildBoar',
        icon: '🐗',
        scientificName: 'Sus scrofa',
        currentPos: [22.5500, 88.4998],
        territory: [
            [22.5490, 88.4988],
            [22.5510, 88.4998],
            [22.5520, 88.5008],
            [22.5510, 88.5018],
            [22.5490, 88.5008],
            [22.5480, 88.4998]
        ],
        speed: 0.00013, // Increased speed for aggressive movement
        lastUpdate: Date.now(),
        direction: Math.random() * 2 * Math.PI,
        dangerRadius: 25,
        warningRadius: 50,
        threatLevel: 'MEDIUM',
        habitat: 'Dense undergrowth and muddy areas'
    }
};