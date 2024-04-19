export class LessonDto {
  constructor(
      public _id: string,
      public lesson_name: string,
      public array_o_chars: string[],
      public group: { name: string; order: number },
      public extras?: {
        sentences: boolean,
        lang: string,
      }

  ) {  }
    // constructor(partial: Partial<LessonDto>) { // this constructor allows some of the properties to be missing in the DTO and still init it! (at least, according to chatGPT)
    //   Object.assign(this, partial);
    // }
  }