// TASK ZJ:
// Shunday function yozing, u berilgan array ichidagi
// raqamlarni qiymatini hisoblab qaytarsin.
// MASALAN: reduceNestedArray([1, [1, 2, [4]]]); return 8;
// Yuqoridagi misolda, array nested bo'lgan holdatda ham,
// bizning function ularning yig'indisini hisoblab qaytarmoqda.

function reduceNestedArray(arr: (number | (number | (number | number[])[])[])[]): number {
    let stack: (number | (number | (number | number[])[])[])[] = [...arr];
    let sum = 0;
    while (stack.length) {
        let item = stack.pop();
        if (Array.isArray(item)) {
            stack.push(...item);
        } else {
            sum += item as number;
        }
    }
    return sum;
}
// console.log(reduceNestedArray([1, [1, 2, [4]]]));

// TASK ZK:
// Shunday function yozing, bu function har bir soniyada bir marotaba
// console'ga 1'dan 5'gacha bo'lgan raqamlarni chop etsin va
// 5 soniyadan so'ng function o'z ishini to'xtatsin
// MASALAN: printNumbers();

const printNumbersForEvery2Sec = (n: number) => {
    for (let i = 1; i <= n; i++) {
        setTimeout(() => {
            console.log(i)
        }, i * 2000)
    }
}
// printNumbersForEvery2Sec(5);

// ZL-TASK:
// Shunday function yozing, u parametrda berilgan stringni 
// kebab casega otkazib qaytarsin. Bosh harflarni kichik harflarga ham otkazsin.
// MASALAN: stringToKebab(“I love Kebab”) return “i-love-kebab”

function stringToKebab(str) {
    return str
        .split(/\s+/)
        .map(word => word.toLowerCase())
        .join('-');
}
// console.log(stringToKebab("I love Kebab"));

// TASK ZM:
// Shunday function yozing, va bu function parametr
// sifatida raqamlarni qabul qilsin. Bu function qabul qilingan
// raqamlarni orqasiga o'girib qaytarsin
// MASALAN: reverseInteger(123456789); return 987654321;
// Yuqoridagi misolda, function kiritilgan raqamlarni orqasiga
// o'girib (reverse) qilib qaytarmoqda.

function reverseInteger(num) {
    return parseInt(num.toString()
        .split('')
        .reverse()
        .join(''));
}
const result = reverseInteger(123456789)
// console.log("TASK ZM: ", result); 

// TASK ZN:
// Shunday function yozing, uni array va number parametri bo'lsin.
// Function'ning vazifasi ikkinchi parametr'da berilgan raqam, birinchi
// array parametr'ning indeksi bo'yicha hisoblanib, shu indeksgacha bo'lgan
// raqamlarni indeksdan tashqarida bo'lgan raqamlar bilan o'rnini
// almashtirib qaytarsin.
// MASALAN: rotateArray([1, 2, 3, 4, 5, 6], 3); return [5, 6, 1, 2, 3, 4];

function rotateArray(arry1: number[], arry2: number) {

    let javob1 = arry1.slice(arry2 + 1);
    let javob2 = arry1.slice(0, arry2 + 1);

    let result = javob1.concat(javob2);
    return result
}
const result1 = rotateArray([1, 2, 3, 4, 5, 6], 3);
// console.log("TASK ZM: ", result1); 

// ZO-TASK:

// Shunday function yozing, u parametrdagi string ichidagi qavslar miqdori balansda ekanligini aniqlasin. 
// Ya'ni ochish("(") va yopish(")") qavslar soni bir xil bolishi kerak.
// MASALAN: areParenthesesBalanced("string()ichida(qavslar)soni()balansda") return true

function areParenthesesBalanced(str) {
    let balance = 0;

    for (let char of str) {
        if (char === '(') {
            balance++;
        } else if (char === ')') {
            balance--;
        }

        if (balance < 0) {
            return false;
        }
    }

    return balance === 0;
}

// console.log(areParenthesesBalanced("string()ichida(qavslar)soni()balansda")); 

// Shunday function yozing, u 2 ta array parametr qabul qilsin.
// Siz bu ikki arrayning qiymatlari o'xshash bo'lishini 
// (ya'ni, ularning barcha elementlari bir xil bo'lishini) tekshirishingiz kerak.

// MASALAN:
// areArraysEqual([1, 2, 3], [3, 1, 2]) // true
// areArraysEqual([1, 2, 3], [3, 1, 2, 1]) // true
// areArraysEqual([1, 2, 3], [4, 1, 2]) // false

function areArraysEqual(array1: number[], array2: number[]) {

    array1.sort();
    array2.sort();

    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
}
const result2 = areArraysEqual([1, 2, 3], [3, 1, 2]);
// console.log(result2)

// TASK ZQ:
// Shunday function yozing, bu function berilgan array parametr
// ichida ikki marotaba yoki undan ko'p takrorlangan sonlarni alohida
// array'da yagonadan qaytarsin qaytarsin.
// MASALAN: findDuplicates([1,2,3,4,5,4,3,4]); return [3, 4];

function findDuplicates(arr: number[]): number[] {
    let seen = new Set<number>();
    let duplicates = new Set<number>();

    for (let num of arr) {
        if (seen.has(num)) {
            duplicates.add(num);
        } else {
            seen.add(num);
        }
    }

    return Array.from(duplicates);
}

// console.log(findDuplicates([1, 2, 3, 4, 5, 4, 3, 4]));

// TASK ZR:
// Shunday function yozing, bu function,
// berilgan parametr string tarkibidagi raqam va sonlarni
// sanab object sifatida qaytarsin.
// MASALAN: countNumberAndLetters(“string152%\¥”); return {number: 3, letter: 6};



function countNumberAndLetters(str: string) {
    const natija = {
        number: (str.match(/\d/g) || []).length,
        letter: (str.match(/[a-zA-Z]/g) || []).length
    };

    return natija
}

// console.log(countNumberAndLetters("string152%\¥")); 

// TASK ZS:
// Shunday function yozing, bu function parametrdagi array ichida
// bir marotaba takrorlangan element'ni qaytarsin
// MASALAN: singleNumber([4, 2, 1, 2, 1]); return 4;

function singleNumber(nums: number[]): number {
    return nums.reduce((acc, num) => acc ^ num, 0);
}

// console.log(singleNumber([4, 2, 1, 2, 1]));


// TASK ZT:
// Shunday function yozing, bu function parametrdagi string ichida
// bir marotabadan ortiq qaytarilmagan birinchi harf indeksini qaytarsin
// MASALAN: firstUniqueCharIndex(“stamp”); return 0;
// Yuqoridagi misolda, 'stamp' so'zi tarkibida barcha harflar bir marotabadan
// ortiq takrorlanmagan, lekin shartga muvofiq, birinchi topilgan harf indeksi qaytarilmoqda.

function firstUniqueCharIndex(str: string): number {
    for (let i = 0; i < str.length; i++) {
        if (str.indexOf(str[i]) === i && str.indexOf(str[i], i + 1) === -1) {
            return i;
        }
    }
    return 0;
}

//   console.log(firstUniqueCharIndex("sttamp"));


//   TASK ZU:
// Shunday function yozing, va bu function parametr sifatida
// raqamlardan iborat array'ni qabul qilsin. Function'ning vazifasi,
// berilgan parametr array tarkibida takrorlanmagan raqamlarni topib
// ularni yig'indisini qaytarsin.
// MASALAN: sumOfUnique([1,2,3,2]); return 4;
// Yuqoridagi misolda, argument sifatida pass qilinayotgan array
// tarkibida bir marotabadan ortiq takrorlanmagan raqamlar, bular '1', '3'.
// Va natija sifatida yig'indi 4'ga teng.

function sumOfUnique(nums: number[]) {
    const count: { [key: number]: number } = {}

    nums.forEach((num) => {
        if (count[num]){
        count[num] +=1;
        } else {
            count[num] = 1;
        }
    });

    let sum = 0;
    for (let key in count) {
        if(count[key] === 1){
            sum += Number(key);
        }
    } 
    return sum 
}

console.log("Natija: ", sumOfUnique([7,1,8,1]))
