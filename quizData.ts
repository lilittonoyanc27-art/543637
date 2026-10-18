import type { QuizQuestion } from './types.ts';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple_choice',
    typeLabelEs: 'Pregunta de Selección',
    typeLabelRu: 'Выбор ответа',
    typeLabelHy: 'Ընտրովի պատասխան',
    questionEs: '¿Con quién compara o sueña ver un duelo el periodista al inicio del video?',
    questionHy: 'Ո՞ւմ հետ է լրագրողը տեսնում կամ երազում տեսնել մենամարտ տեսանյութի սկզբում:',
    options: [
      { id: 'a', textEs: 'Kylian Mbappé', textHy: 'Կիլիան Մբապպե' },
      { id: 'b', textEs: 'Lionel Messi', textHy: 'Լիոնել Մեսսի' },
      { id: 'c', textEs: 'Neymar Jr', textHy: 'Նեյմար' },
      { id: 'd', textEs: 'Erling Haaland', textHy: 'Էրլինգ Հոլանդ' }
    ],
    correctOptionId: 'b',
    explanationEs: 'El periodista dice: "a todo el mundo del fútbol, poder ver un duelo Cristiano Ronaldo contra Lionel Messi".',
    explanationHy: 'Լրագրողն ասում է. «ողջ ֆուտբոլային աշխարհը կցանկանար տեսնել Կրիշտիանու Ռոնալդուի մենամարտը Լիոնել Մեսսիի դեմ»:',
    sourceTimestamp: 0
  },
  {
    id: 2,
    type: 'comprehension',
    typeLabelEs: 'Comprensión del Sentido',
    typeLabelRu: 'Понимание смысла',
    typeLabelHy: 'Իմաստի ըմբռնում',
    questionEs: 'Según Cristiano, ¿qué era lo más importante del día de hoy?',
    questionHy: 'Ըստ Կրիշտիանուի՝ ո՞րն էր այսօրվա ամենակարևոր բանը:',
    options: [
      { id: 'a', textEs: 'Ganar para pasar en el grupo y estar preparado', textHy: 'Հաղթել՝ խմբից դուրս գալու և պատրաստ լինելու համար' },
      { id: 'b', textEs: 'Hablar de Lionel Messi y su rivalidad', textHy: 'Խոսել Լիոնել Մեսսիի և նրանց մրցակցության մասին' },
      { id: 'c', textEs: 'Pensar en las vacaciones', textHy: 'Մտածել արձակուրդի մասին' },
      { id: 'd', textEs: 'Quejarse de los árbitros', textHy: 'Բողոքել մրցավարներից' }
    ],
    correctOptionId: 'a',
    explanationEs: 'Cristiano afirma: "Sería top, pero lo más importante era hoy. Ganar para pasar en el grupo y estar preparado para lo que viene".',
    explanationHy: 'Կրիշտիանուն նշում է. «Թոփ կլիներ, բայց ամենակարևորն այսօրվա օրն էր. հաղթել՝ խմբից դուրս գալու համար»:',
    sourceTimestamp: 27
  },
  {
    id: 3,
    type: 'multiple_choice',
    typeLabelEs: 'Rival Siguiente',
    typeLabelRu: 'Следующий соперник',
    typeLabelHy: 'Հաջորդ մրցակիցը',
    questionEs: '¿Contra qué selección dice Cristiano que tendrán un "partido duro"?',
    questionHy: 'Ո՞ր հավաքականի դեմ է Կրիշտիանուն ասում, որ իրենց սպասվում է «ծանր խաղ»:',
    options: [
      { id: 'a', textEs: 'Brasil', textHy: 'Բրազիլիա' },
      { id: 'b', textEs: 'Argentina', textHy: 'Արգենտինա' },
      { id: 'c', textEs: 'Colombia', textHy: 'Կոլումբիա' },
      { id: 'd', textEs: 'Francia', textHy: 'Ֆրանսիա' }
    ],
    correctOptionId: 'c',
    explanationEs: 'Cristiano menciona expresamente: "Sabemos que vamos a tener un partido duro contra Colombia".',
    explanationHy: 'Կրիշտիանուն ուղղակիորեն նշում է. «Գիտենք, որ մեզ ծանր խաղ է սպասվում Կոլումբիայի դեմ»:',
    sourceTimestamp: 35
  },
  {
    id: 4,
    type: 'true_false',
    typeLabelEs: 'Verdadero o Falso',
    typeLabelRu: 'Правда / Ложь',
    typeLabelHy: 'Ճիշտ է, թե սխալ',
    questionEs: '¿Cristiano Ronaldo marcó goles y ayudó a su equipo en este partido?',
    questionHy: 'Կրիշտիանու Ռոնալդուն գոլ խփե՞ց և օգնե՞ց իր թիմին այս խաղում:',
    options: [
      { id: 'a', textEs: 'Verdadero (Sí, jugó bien y marcó)', textHy: 'Ճիշտ է (Այո, լավ խաղաց և գոլ խփեց)' },
      { id: 'b', textEs: 'Falso (No jugó ni marcó)', textHy: 'Սխալ է (Չխաղաց և գոլ չխփեց)' }
    ],
    correctOptionId: 'a',
    explanationEs: 'En el minuto 0:43 Cristiano dice: "Jugué bien, marqué, ayudé al equipo, el equipo ha estado muy bien y seguimos".',
    explanationHy: '0:43 րոպեին Կրիշտիանուն ասում է. «Լավ խաղացի, գոլ խփեցի, օգնեցի թիմին...»:',
    sourceTimestamp: 43
  },
  {
    id: 5,
    type: 'who_said',
    typeLabelEs: '¿Quién lo dijo?',
    typeLabelRu: 'Кто это сказал?',
    typeLabelHy: 'Ո՞վ է ասել',
    questionEs: '¿Quién pronunció la frase filosófica: "Mejoramos. La vida es así"?',
    questionHy: 'Ո՞վ է ասել այս իմաստալից միտքը. «Մենք կատարելագործվեցինք: Կյանքն այդպիսին է» (Mejoramos. La vida es así):',
    options: [
      { id: 'a', textEs: 'El periodista', textHy: 'Լրագրողը' },
      { id: 'b', textEs: 'Cristiano Ronaldo', textHy: 'Կրիշտիանու Ռոնալդուն' },
      { id: 'c', textEs: 'El entrenador de Portugal', textHy: 'Պորտուգալիայի մարզիչը' },
      { id: 'd', textEs: 'Lionel Messi', textHy: 'Լիոնել Մեսսին' }
    ],
    correctOptionId: 'b',
    explanationEs: 'Ante la pregunta de qué cambió, Cristiano responde con seguridad: "Mejoramos. La vida es así".',
    explanationHy: 'Հարցին, թե ինչը փոխվեց, Կրիշտիանուն պատասխանում է. «Մենք ավելի լավը դարձանք: Կյանքն այդպիսին է»:',
    sourceTimestamp: 59
  },
  {
    id: 6,
    type: 'multiple_choice',
    typeLabelEs: 'Años de Carrera',
    typeLabelRu: 'Годы в профессии',
    typeLabelHy: 'Տարիներ պրոֆեսիոնալ ֆուտբոլում',
    questionEs: '¿Cuántos años de profesión dice tener Cristiano Ronaldo?',
    questionHy: 'Քանի՞ տարի է Կրիշտիանու Ռոնալդուն պրոֆեսիոնալ կարիերայում՝ ըստ իր խոսքերի:',
    options: [
      { id: 'a', textEs: '10 años', textHy: '10 տարի' },
      { id: 'b', textEs: '18 años', textHy: '18 տարի' },
      { id: 'c', textEs: '23 años', textHy: '23 տարի' },
      { id: 'd', textEs: '30 años', textHy: '30 տարի' }
    ],
    correctOptionId: 'c',
    explanationEs: 'Cristiano resalta su enorme experiencia: "ya son 23 años de profesión".',
    explanationHy: 'Կրիշտիանուն շեշտում է իր փորձը. «արդեն 23 տարի է այս մասնագիտության մեջ»:',
    sourceTimestamp: 84
  },
  {
    id: 7,
    type: 'comprehension',
    typeLabelEs: 'Crítica y Prensa',
    typeLabelRu: 'Критика и пресса',
    typeLabelHy: 'Քննադատություն և մամուլ',
    questionEs: '¿Qué dice la opinión pública de Cristiano cuando las cosas van mal, según él?',
    questionHy: 'Ի՞նչ է ասում հասարակական կարծիքը Կրիշտիանուի մասին, երբ գործերը վատ են ընթանում:',
    options: [
      { id: 'a', textEs: '"Es un retirado, ya está viejo"', textHy: '«Նա արդեն թոշակառու է, արդեն ծեր է»' },
      { id: 'b', textEs: '"Es el mejor del mundo siempre"', textHy: '«Նա միշտ աշխարհի լավագույնն է»' },
      { id: 'c', textEs: '"Tiene mala suerte"', textHy: '«Նրա բախտը չի բերում»' },
      { id: 'd', textEs: '"Debe cambiar de equipo"', textHy: '«Նա պետք է փոխի ակումբը»' }
    ],
    correctOptionId: 'a',
    explanationEs: 'Cristiano comenta: "cuando las cosas van bien, Cristiano bien, cuando va mal, es un retirado, ya está viejo".',
    explanationHy: 'Կրիշտիանուն նշում է, որ երբ գործերը վատ են ընթանում, ասում են. «Նա արդեն թոշակառու է, արդեն ծեր է»:',
    sourceTimestamp: 89
  },
  {
    id: 8,
    type: 'complete_phrase',
    typeLabelEs: 'Continúa la Frase',
    typeLabelRu: 'Продолжи фразу',
    typeLabelHy: 'Շարունակիր նախադասությունը',
    questionEs: 'Completa las palabras de Cristiano: "No es coincidencia que marcamos cinco goles. Hoy en día en el fútbol..."',
    questionHy: 'Լրացրու Կրիշտիանուի խոսքերը. «Պատահականություն չէ, որ հինգ գոլ խփեցինք: Մեր օրերում ֆուտբոլում...» (Hoy en día en el fútbol...):',
    options: [
      { id: 'a', textEs: '...es muy difícil.', textHy: '...դա շատ դժվար/բարդ է:' },
      { id: 'b', textEs: '...es muy fácil marcar.', textHy: '...շատ հեշտ է գոլ խփել:' },
      { id: 'c', textEs: '...nadie defiende bien.', textHy: '...ոչ ոք լավ չի պաշտպանվում:' },
      { id: 'd', textEs: '...solo importa el dinero.', textHy: '...միայն փողն է կարևոր:' }
    ],
    correctOptionId: 'a',
    explanationEs: 'La frase completa es: "No es coincidencia que marcamos cinco goles. Hoy en día en el fútbol es muy difícil".',
    explanationHy: 'Ամբողջական նախադասությունն է. «Պատահականություն չէ, որ հինգ գոլ խփեցինք: Մեր օրերում ֆուտբոլում դա շատ դժվար է»:',
    sourceTimestamp: 104
  },
  {
    id: 9,
    type: 'multiple_choice',
    typeLabelEs: 'Goles de Portugal',
    typeLabelRu: 'Голы Португалии',
    typeLabelHy: 'Պորտուգալիայի գոլերը',
    questionEs: '¿Cuántos goles destacó Cristiano que marcó Portugal en el partido?',
    questionHy: 'Քանի՞ գոլ նշեց Կրիշտիանուն, որ Պորտուգալիան խփեց այս խաղում:',
    options: [
      { id: 'a', textEs: 'Dos goles (2)', textHy: 'Երկու գոլ (2)' },
      { id: 'b', textEs: 'Tres goles (3)', textHy: 'Երեք գոլ (3)' },
      { id: 'c', textEs: 'Cinco goles (5)', textHy: 'Հինգ գոլ (5)' },
      { id: 'd', textEs: 'Siete goles (7)', textHy: 'Յոթ գոլ (7)' }
    ],
    correctOptionId: 'c',
    explanationEs: 'Cristiano dijo claramente: "No es coincidencia que marcamos cinco goles".',
    explanationHy: 'Կրիշտիանուն հստակ նշեց. «Պատահականություն չէ, որ մենք հինգ գոլ խփեցինք»:',
    sourceTimestamp: 104
  },
  {
    id: 10,
    type: 'comprehension',
    typeLabelEs: 'Táctica del Equipo',
    typeLabelRu: 'Тактика команды',
    typeLabelHy: 'Թիմի տակտիկան',
    questionEs: '¿Cómo explicó Cristiano el éxito táctico del equipo en el campo?',
    questionHy: 'Ինչպե՞ս բացատրեց Կրիշտիանուն դաշտում թիմի տակտիկական հաջողությունը:',
    options: [
      { id: 'a', textEs: 'Estábamos bien posicionados, jugamos con las líneas arriba', textHy: 'Լավ դիրքավորված էինք, խաղացինք առաջ քաշված բարձր գծերով' },
      { id: 'b', textEs: 'Nos defendimos todo el tiempo atrás', textHy: 'Ամբողջ ժամանակ միայն հետևում պաշտպանվում էինք' },
      { id: 'c', textEs: 'Solo dependimos de la suerte', textHy: 'Միայն բախտի վրա հույս դրեցինք' },
      { id: 'd', textEs: 'Jugamos con un solo delantero', textHy: 'Խաղացինք ընդամենը մեկ հարձակվողով' }
    ],
    correctOptionId: 'a',
    explanationEs: 'Cristiano detalló: "Estábamos bien posicionados, jugamos bien, jugamos con las líneas arriba. Y cuando así es muy difícil parar Portugal".',
    explanationHy: 'Կրիշտիանուն մանրամասնեց. «Լավ դիրքավորված էինք, բարձր գծերով խաղացինք: Եվ այդպես շատ դժվար է կանգնեցնել Պորտուգալիային»:',
    sourceTimestamp: 98
  },
  {
    id: 11,
    type: 'comprehension',
    typeLabelEs: 'Sentimiento Final',
    typeLabelRu: 'Чувства в конце',
    typeLabelHy: 'Զգացողությունները վերջում',
    questionEs: '¿Cómo se siente Cristiano al final del video y qué planea hacer ahora?',
    questionHy: 'Ինչպե՞ս է իրեն զգում Կրիշտիանուն տեսանյութի վերջում և ի՞նչ է պատրաստվում անել հիմա:',
    options: [
      { id: 'a', textEs: 'Está muy contento; ahora a descansar y seguir para lo próximo', textHy: 'Շատ ուրախ է. հիմա հանգստանալ և շարժվել առաջ դեպի հաջորդը' },
      { id: 'b', textEs: 'Está enfadado y va a retirarse del fútbol', textHy: 'Բարկացած է և պատրաստվում է հեռանալ ֆուտբոլից' },
      { id: 'c', textEs: 'Está preocupado y va a entrenar toda la noche', textHy: 'Անհանգստացած է և պատրաստվում է մարզվել ողջ գիշեր' },
      { id: 'd', textEs: 'Está triste por las críticas', textHy: 'Տխուր է քննադատությունների պատճառով' }
    ],
    correctOptionId: 'a',
    explanationEs: 'Cristiano concluye con optimismo: "Y la verdad es que estoy muy contento. Ahora a descansar y seguir para lo próximo".',
    explanationHy: 'Կրիշտիանուն եզրափակում է լավատեսությամբ. «Ճշմարտությունն այն է, որ ես շատ ուրախ եմ: Հիմա հանգստանալ և շարունակել հաջորդի համար»:',
    sourceTimestamp: 109
  },
  {
    id: 12,
    type: 'true_false',
    typeLabelEs: 'Verdadero o Falso',
    typeLabelRu: 'Правда / Ложь',
    typeLabelHy: 'Ճիշտ է, թե սխալ',
    questionEs: '¿La opinión pública y la prensa habían sido muy duras con el equipo y con Cristiano antes de este partido?',
    questionHy: 'Հասարակական կարծիքն ու մամուլը շատ խիստ ու դաժա՞ն էին եղել թիմի և Կրիշտիանուի հանդեպ այս խաղից առաջ:',
    options: [
      { id: 'a', textEs: 'Verdadero (Fue una semana muy dura con críticas)', textHy: 'Ճիշտ է (Շատ ծանր շաբաթ էր քննադատություններով)' },
      { id: 'b', textEs: 'Falso (Toda la semana fue de puros elogios)', textHy: 'Սխալ է (Ամբողջ շաբաթը միայն գովեստներ էին)' }
    ],
    correctOptionId: 'a',
    explanationEs: 'Cristiano dijo: "Puedo decir que fue una semana muy dura, una semana difícil. Una semana que la opinión pública fue muy dura con nosotros...".',
    explanationHy: 'Կրիշտիանուն նշել է. «Կարող եմ ասել, որ դա շատ ծանր ու դժվար շաբաթ էր, երբ հասարակական կարծիքը շատ դաժան էր մեր հանդեպ...»:',
    sourceTimestamp: 69
  }
];
