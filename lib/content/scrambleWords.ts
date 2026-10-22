export interface ScrambleWord {
  word: string
  category: string
}

const group = (category: string, words: string[]): ScrambleWord[] =>
  words.map((word) => ({ word, category }))

export const SCRAMBLE_WORDS: ScrambleWord[] = [
  ...group('Animal', [
    'elephant', 'giraffe', 'leopard', 'cheetah', 'buffalo', 'crocodile', 'antelope', 'springbok', 'zebra', 'penguin',
    'dolphin', 'octopus', 'squirrel', 'rabbit', 'monkey', 'gorilla', 'kangaroo', 'panther', 'tiger', 'turtle',
    'tortoise', 'lizard', 'spider', 'scorpion', 'butterfly', 'dragonfly', 'mosquito', 'ostrich', 'flamingo', 'parrot',
    'pigeon', 'eagle', 'vulture', 'sparrow', 'chicken', 'donkey', 'camel', 'hyena', 'warthog', 'meerkat',
    'rhino', 'jackal', 'baboon', 'mongoose', 'porcupine', 'hedgehog', 'beaver', 'whale', 'shark', 'lobster',
    'oyster', 'jellyfish', 'seahorse', 'peacock', 'hamster', 'goldfish', 'caterpillar', 'grasshopper', 'chameleon', 'wildebeest',
  ]),
  ...group('Food and drink', [
    'chocolate', 'sandwich', 'pancake', 'spaghetti', 'hamburger', 'potato', 'tomato', 'banana', 'orange', 'lemon',
    'mango', 'pineapple', 'strawberry', 'avocado', 'cucumber', 'carrot', 'cabbage', 'spinach', 'pumpkin', 'onion',
    'garlic', 'pepper', 'butter', 'cheese', 'yoghurt', 'cereal', 'porridge', 'biscuit', 'cookie', 'cupcake',
    'muffin', 'doughnut', 'noodles', 'popcorn', 'sausage', 'bacon', 'omelette', 'lasagne', 'curry', 'chutney',
    'mustard', 'vinegar', 'ketchup', 'coffee', 'lemonade', 'smoothie', 'milkshake', 'champagne', 'cocktail', 'honey',
    'sugar', 'pudding', 'custard', 'caramel', 'peanut', 'walnut', 'almond', 'coconut', 'watermelon', 'peach',
    'grapes', 'cherry', 'broccoli', 'mushroom', 'lettuce', 'beetroot', 'sweetcorn',
  ]),
  ...group('Around the house', [
    'kitchen', 'bedroom', 'bathroom', 'window', 'blanket', 'pillow', 'mattress', 'curtain', 'mirror', 'carpet',
    'ceiling', 'staircase', 'garden', 'garage', 'fridge', 'freezer', 'kettle', 'toaster', 'microwave', 'cupboard',
    'drawer', 'hammer', 'ladder', 'bucket', 'broom', 'candle', 'clock', 'couch', 'table', 'chair',
    'shelf', 'balcony', 'doorbell', 'towel', 'shower', 'shampoo', 'toothbrush', 'wardrobe', 'chimney', 'bookshelf',
  ]),
  ...group('Nature and weather', [
    'mountain', 'river', 'ocean', 'forest', 'desert', 'island', 'volcano', 'waterfall', 'thunder', 'lightning',
    'rainbow', 'sunshine', 'storm', 'breeze', 'cloud', 'snowflake', 'blizzard', 'earthquake', 'valley', 'canyon',
    'meadow', 'jungle', 'beach', 'coastline', 'sunset', 'sunrise', 'moonlight', 'planet', 'galaxy', 'comet',
    'meteor', 'universe', 'horizon', 'glacier', 'lagoon', 'swamp', 'savanna',
  ]),
  ...group('Travel and transport', [
    'airplane', 'helicopter', 'bicycle', 'motorbike', 'train', 'station', 'airport', 'passport', 'luggage',
    'suitcase', 'ticket', 'highway', 'bridge', 'tunnel', 'harbour', 'ferry', 'rocket', 'tractor', 'ambulance',
    'journey', 'holiday', 'tourist', 'camping', 'adventure', 'compass', 'backpack', 'souvenir', 'hotel', 'runway',
    'minibus', 'safari',
  ]),
  ...group('School and work', [
    'teacher', 'student', 'library', 'notebook', 'pencil', 'eraser', 'textbook', 'homework', 'classroom', 'calculator',
    'scientist', 'doctor', 'nurse', 'farmer', 'builder', 'plumber', 'mechanic', 'engineer', 'lawyer', 'pilot',
    'soldier', 'police', 'firefighter', 'manager', 'secretary', 'meeting', 'salary', 'office', 'computer', 'keyboard',
    'internet', 'password', 'printer', 'camera', 'telephone', 'battery', 'charger', 'headphones', 'speaker', 'television',
  ]),
  ...group('Body and health', [
    'shoulder', 'elbow', 'finger', 'forehead', 'eyebrow', 'stomach', 'muscle', 'kidney', 'skeleton', 'medicine',
    'hospital', 'vitamin', 'bandage', 'headache', 'sneeze',
  ]),
  ...group('Clothes', [
    'trousers', 'sweater', 'jacket', 'sandals', 'sneakers', 'necklace', 'bracelet', 'earrings', 'umbrella', 'handbag',
    'sunglasses', 'scarf', 'jersey', 'nike', 'adidas', 'puma', 'uniform', 'pyjamas', 'raincoat', 'gloves', 'button',
    'zipper', 'fashion','underwaer', 'gucci', 'luella', 'jumpsuits',
  ]),
  ...group('Sport and fun', [
    'football', 'rugby', 'cricket', 'tennis', 'netball', 'athletics', 'swimming', 'marathon', 'trophy', 'champion',
    'stadium', 'referee', 'goalkeeper', 'penalty', 'whistle', 'guitar', 'piano', 'drums', 'trumpet', 'saxophone',
    'violin', 'singer', 'dancer', 'concert', 'festival', 'karaoke', 'orchestra', 'melody', 'rhythm', 'microphone',
    'movie', 'cinema', 'actor', 'comedy', 'cartoon', 'puzzle', 'balloon', 'birthday', 'present', 'picnic',
  ]),
  ...group('South Africa', [
    'braai', 'biltong', 'boerewors', 'soweto', 'durban', 'pretoria', 'limpopo', 'kruger', 'lekker', 'amapiano',
    'vuvuzela', 'rooibos', 'mealie', 'bobotie', 'koeksister', 'melktert', 'sosatie', 'potjie', 'tekkies', 'ubuntu',
    'shweshwe', 'protea', 'mzansi', 'kombi', 'madiba', 'bunnychow', 'gatsby',
  ]),
]