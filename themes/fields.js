window.CertFields = {
  fields: [
    {id:"ai", en:"Artificial Intelligence and Data Science", ar:"الذكاء الاصطناعي وعلم البيانات"},
    {id:"cyber", en:"Cybersecurity and Networks", ar:"الأمن السيبراني والشبكات"},
    {id:"code", en:"Programming and Software Development", ar:"البرمجة وتطوير البرمجيات"},
    {id:"cloud", en:"Cloud and Digital Government", ar:"السحابة والحكومة الرقمية"},
    {id:"agile", en:"Project Management and Agile", ar:"إدارة المشاريع وأجايل"},
    {id:"design", en:"Design and UX", ar:"التصميم وتجربة المستخدم"},
    {id:"business", en:"Business and Soft Skills", ar:"الأعمال والمهارات الشخصية"},
    {id:"office", en:"Office and Productivity", ar:"المكتب والإنتاجية"},
    {id:"prize", en:"Competitions", ar:"المسابقات"}
  ],
  issuers: [
    {id:"satr", en:"Satr", ar:"سطر"},
    {id:"doroob", en:"Doroob (HRDF)", ar:"دروب (هدف)"},
    {id:"sdaia", en:"SDAIA", ar:"سدايا"},
    {id:"nvidia", en:"NVIDIA", ar:"NVIDIA"},
    {id:"ibm", en:"IBM", ar:"IBM"},
    {id:"other", en:"Other", ar:"أخرى"}
  ],
  label: function(mode, id, ar){
    var list = mode === "issuer" ? this.issuers : this.fields;
    var row = null;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) row = list[i];
    if (!row) return id;
    return ar ? row.ar : row.en;
  },
  group: function(items, mode){
    var order = mode === "issuer" ? this.issuers : this.fields;
    var key = mode === "issuer" ? "group" : "field";
    var buckets = {};
    items.forEach(function(item){
      var id = item[key] || "other";
      (buckets[id] || (buckets[id] = [])).push(item);
    });
    var out = [];
    order.forEach(function(row){
      if (buckets[row.id] && buckets[row.id].length) out.push({id: row.id, en: row.en, ar: row.ar, items: buckets[row.id]});
    });
    return out;
  }
};
