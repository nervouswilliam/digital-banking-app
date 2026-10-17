import { useEffect, useState, type ReactNode } from 'react';
import { personas, type LoanQuote, type PersonaId } from '../data/mockData';
import { AppHeader, PhoneFrame } from './Layout';
import { AnalysingScreen, ConnectScreen, PermissionScreen, WelcomeScreen } from './IntroScreens';
import { AffordabilityScreen, BizCashFlowScreen, CapitalNeedScreen, GlanceScreen } from './MoneyScreens';
import { AcceptedScreen, ApprovedScreen, MyDataScreen, NotNowScreen, NotYetScreen, SitiCompareScreen } from './ResultScreens';

type ScreenId =
  | 'welcome'
  | 'permission'
  | 'connect'
  | 'analysing'
  | 'glance'
  | 'bizCashflow'
  | 'capitalNeed'
  | 'affordability'
  | 'result'
  | 'compare'
  | 'accepted'
  | 'notNow'
  | 'myData';

const STEP: Partial<Record<ScreenId, number>> = {
  permission: 1,
  connect: 2,
  analysing: 3,
  glance: 4,
  bizCashflow: 4,
  capitalNeed: 4,
  affordability: 4,
  result: 5,
  compare: 5,
};

export default function CustomerApp({ personaId }: { personaId: PersonaId }) {
  const persona = personas[personaId];
  const [history, setHistory] = useState<ScreenId[]>(['welcome']);
  const [acceptedLoan, setAcceptedLoan] = useState<LoanQuote | null>(null);
  const screen = history[history.length - 1];

  const go = (s: ScreenId) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => {
    const prev = h.slice(0, -1);
    // never step back into the automatic "analysing" screen
    while (prev.length > 1 && prev[prev.length - 1] === 'analysing') prev.pop();
    return prev;
  });
  const restart = () => {
    setHistory(['welcome']);
    setAcceptedLoan(null);
  };
  const accept = (loan: LoanQuote) => {
    setAcceptedLoan(loan);
    go('accepted');
  };

  const canGoBack = history.length > 1 && !['analysing', 'glance', 'bizCashflow', 'accepted', 'notNow', 'myData'].includes(screen);
  const isBiz = persona.kind === 'business';

  let body;
  switch (screen) {
    case 'welcome':
      body = <WelcomeScreen persona={persona} onNext={() => go('permission')} />;
      break;
    case 'permission':
      body = <PermissionScreen onNext={() => go('connect')} />;
      break;
    case 'connect':
      body = <ConnectScreen persona={persona} onNext={() => go('analysing')} />;
      break;
    case 'analysing':
      body = <AnalysingScreen persona={persona} onDone={() => go(isBiz ? 'bizCashflow' : 'glance')} />;
      break;
    case 'glance':
      body = <GlanceScreen persona={persona} onNext={() => go('result')} />;
      break;
    case 'bizCashflow':
      body = <BizCashFlowScreen onNext={() => go('capitalNeed')} />;
      break;
    case 'capitalNeed':
      body = <CapitalNeedScreen onNext={() => go('affordability')} />;
      break;
    case 'affordability':
      body = <AffordabilityScreen onNext={() => go('result')} />;
      break;
    case 'result':
      body =
        persona.outcome === 'approved' ? (
          <ApprovedScreen
            persona={persona}
            onAccept={() => accept(persona.loan!)}
            onSecondary={() => go(isBiz ? 'compare' : 'notNow')}
          />
        ) : (
          <NotYetScreen persona={persona} onNext={() => go('myData')} />
        );
      break;
    case 'compare':
      body = <SitiCompareScreen recommended={persona.loan!} onChoose={accept} />;
      break;
    case 'accepted':
      body = <AcceptedScreen persona={persona} loan={acceptedLoan ?? persona.loan!} onNext={() => go('myData')} />;
      break;
    case 'notNow':
      body = <NotNowScreen persona={persona} onNext={() => go('myData')} />;
      break;
    case 'myData':
      body = <MyDataScreen persona={persona} onFinish={restart} />;
      break;
  }

  return (
    <FitToScreen>
      <PhoneFrame>
        <AppHeader onBack={canGoBack ? back : undefined} step={STEP[screen]} />
        {/* key forces a fresh screen (and its fade-in) on every navigation */}
        <div key={`${screen}-${history.length}`} className="flex min-h-0 flex-1 flex-col">
          {body}
        </div>
      </PhoneFrame>
    </FitToScreen>
  );
}

const PHONE_H = 800;
const PHONE_W = 390;

/** Shrinks the phone on short screens (laptops) so the whole frame is always visible. */
function FitToScreen({ children }: { children: ReactNode }) {
  const calc = () => Math.min(1, Math.max(0.55, (window.innerHeight - 140) / PHONE_H));
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return (
    <div style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: PHONE_W, height: PHONE_H }}>{children}</div>
    </div>
  );
}
