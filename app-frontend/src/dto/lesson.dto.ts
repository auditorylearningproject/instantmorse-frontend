export interface LessonDto {
    id: string;
    lesson_name: string;
    array_o_chars: string[];
    group: { name: string; order: number };
    
    // constructor(partial: Partial<LessonDto>) { // this constructor allows some of the properties to be missing in the DTO and still init it! (at least, according to chatGPT)
    //   Object.assign(this, partial);
    // }
  }