const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');
const idx = code.indexOf('setAllData: (data) =>');
if (idx > -1) {
  code = code.substring(0, idx) + `setAllData: (data) =>
        set((state) => ({
          students: data.students || [],
          coaches: data.coaches || [],
          assessments: data.assessments || [],
          attendances: data.attendances || [],
          evaluations: data.evaluations || [],
          schedules: data.schedules || [],
          settings: {
            ...(data.settings || defaultSettings),
            bgmList: state.settings?.bgmList || []
          },
        })),
    }),
    {
      name: 'academy-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);`;
  fs.writeFileSync('src/store.ts', code);
}
