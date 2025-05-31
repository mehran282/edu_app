export interface TestFlashcard {
  id: string;
  statement: string;
  explanation: string | null;
  optionId: string;
  topicTitle: string;
}

export class TestDataService {
  static getTestCards(): TestFlashcard[] {
    return [
      {
        id: '1',
        statement: 'جانوران می‌توانند با استفاده از رنگ‌های مختلف با یکدیگر ارتباط برقرار کنند.',
        explanation: 'جانوران از رنگ‌های مختلف برای ارتباط استفاده می‌کنند، مانند رنگ‌های زیبای طاووس برای جلب توجه.',
        optionId: 'test-001',
        topicTitle: 'فصل ۸: رفتارهای جانوران'
      },
      {
        id: '2',
        statement: '12- تمام پرندگان قابلیت پرواز دارند.',
        explanation: 'این گزاره غلط است. برخی پرندگان مانند شترمرغ و پنگوئن قابلیت پرواز ندارند.',
        optionId: 'test-002',
        topicTitle: 'فصل ۵: پرندگان'
      },
      {
        id: '3',
        statement: '3.1- گیاهان فتوسنتز انجام می‌دهند و اکسیژن تولید می‌کنند.',
        explanation: 'این گزاره صحیح است. گیاهان در فرآیند فتوسنتز، دی‌اکسید کربن را جذب کرده و اکسیژن آزاد می‌کنند.',
        optionId: 'test-003',
        topicTitle: 'فصل ۳: گیاهان'
      },
      {
        id: '4',
        statement: '[{"insert":"این متن "},{"insert":"بولد","attributes":{"bold":true}},{"insert":" و "},{"insert":"رنگی","attributes":{"color":"#ff0000"}},{"insert":" است.\\nخط دوم با اعداد فارسی: ۱۲۳۴۵"}]',
        explanation: 'این یک تست JSON است برای بررسی نمایش فرمت‌های مختلف متن. فرمت bold دیگر نمایش داده نخواهد شد.',
        optionId: 'test-004',
        topicTitle: 'تست فرمت JSON'
      },
      {
        id: '5',
        statement: '۱۲۳. دمای بدن انسان معمولاً ۳۷ درجه سانتی‌گراد است.',
        explanation: 'این گزاره صحیح است. دمای طبیعی بدن انسان حدود ۳۶.۵ تا ۳۷.۵ درجه سانتی‌گراد است.',
        optionId: 'test-005',
        topicTitle: 'فصل ۱: فیزیولوژی انسان'
      },
      {
        id: '6',
        statement: '4--- DNA ساختاری مارپیچ دوگانه دارد.',
        explanation: 'این گزاره صحیح است. DNA از دو رشته مارپیچی تشکیل شده که به صورت دوگانه پیچیده شده‌اند.',
        optionId: 'test-006',
        topicTitle: 'فصل ۲: ژنتیک'
      },
      {
        id: '7',
        statement: '[{"insert":"‏26.‏\\tژن‌نمود گياه ذرتي ‏AaBbCc‏ است، در اين صورت قبل از لقاح، هسته‌هاي درون لوله‌ي گرده با هم و هسته‌هاي ‏درون کيسه‌ي روياني نيز با هم، ژن‌هاي يکساني خواهند داشت.‏"}]',
        explanation: 'این گزاره صحیح است. قبل از لقاح، هسته‌های مختلف در گامتوفیت نر و ماده ژن‌های یکسانی دارند.',
        optionId: 'test-007',
        topicTitle: 'فصل ۱۰: ژنتیک گیاهان'
      }
    ];
  }

  static getRandomTestCard(): TestFlashcard {
    const cards = this.getTestCards();
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }

  static getTestCardById(id: string): TestFlashcard | null {
    const cards = this.getTestCards();
    return cards.find(card => card.id === id) || null;
  }
} 