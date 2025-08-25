import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

export interface NiceModalState {
  id: string;
  args?: Record<string, unknown>;
  visible?: boolean;
  delayVisible?: boolean;
  keepMounted?: boolean;
}

export interface NiceModalStore {
  [key: string]: NiceModalState;
}
const initialState: NiceModalStore = {};

export interface NiceModalAction {
  type: string;
  payload: {
    modalId: string;
    args?: Record<string, unknown>;
    flags?: Record<string, unknown>;
  };
}

let uidSeed = 0;
const MODAL_REGISTRY: {
  [id: string]: {
    comp: React.FC<any>;
    props?: Record<string, unknown>;
  };
} = {};

const ALREADY_MOUNTED = {};

const symModalId = Symbol('NiceModalId');

const getModalId = (modal: string | React.FC<any>): string => {
  if (typeof modal === 'string') return modal as string;
  if (!modal[symModalId]) {
    modal[symModalId] = getUid();
  }
  return modal[symModalId];
};

function showModal(
  modalId: string,
  args?: Record<string, unknown>
): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  };
}

export const register = <T extends React.FC<any>>(
  id: string,
  comp: T,
  props?: any
): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props };
  } else {
    MODAL_REGISTRY[id].props = props;
  }
};

let dispatch: React.Dispatch<NiceModalAction> = () => {
  throw new Error(
    'No dispatch method detected, did you embed your app with NiceModal.Provider?'
  );
};

const getUid = () => `_super_control_modal_${uidSeed++}`;
const MyModalIdContext = React.createContext<string | null>(null);

export const reducer = (
  state: NiceModalStore = initialState,
  action: NiceModalAction
): NiceModalStore => {
  switch (action.type) {
    case 'nice-modal/show': {
      const { modalId, args } = action.payload;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          args,
          // If modal is not mounted, mount it first then make it visible.
          // There is logic inside HOC wrapper to make it visible after its first mount.
          // This mechanism ensures the entering transition.
          visible: !!ALREADY_MOUNTED[modalId],
          delayVisible: !ALREADY_MOUNTED[modalId],
        },
      };
    }
    case 'nice-modal/hide': {
      const { modalId } = action.payload;
      if (!state[modalId]) return state;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          visible: false,
        },
      };
    }
    case 'nice-modal/remove': {
      const { modalId } = action.payload;
      const newState = { ...state };
      delete newState[modalId];
      return newState;
    }
    case 'nice-modal/set-flags': {
      const { modalId, flags } = action.payload;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          ...flags,
        },
      };
    }
    default:
      return state;
  }
};
const setFlags = (modalId: string, flags: Record<string, unknown>): void => {
  dispatch(setModalFlags(modalId, flags));
};

// action creator to set flags of a modal
function setModalFlags(
  modalId: string,
  flags: Record<string, unknown>
): NiceModalAction {
  return {
    type: 'nice-modal/set-flags',
    payload: {
      modalId,
      flags,
    },
  };
}

export function show(modal: React.FC<any> | string, args?: any) {
  const modalId = getModalId(modal);
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal as React.FC);
  }
  dispatch(showModal(modalId, args));
}

// action creator to hide a modal
function hideModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/hide',
    payload: {
      modalId,
    },
  };
}

export function hide(modal: string | React.FC<any>) {
  const modalId = getModalId(modal);
  dispatch(hideModal(modalId));
  // Should also delete the callback for modal.resolve #35
}

export const MyModalContext = React.createContext<NiceModalStore>(initialState);

export const useModal = (modal?: any, args?: any) => {
  const contextModalId = useContext(MyModalIdContext);
  const modals = useContext(MyModalContext);
  let modalId: string | null = null;
  const isUseComponent = modal && typeof modal !== 'string';
  if (!modal) {
    modalId = contextModalId;
  } else {
    modalId = getModalId(modal);
  }

  const modalInfo = modals[modalId];
  const showCallback = useCallback(
    (args?: Record<string, unknown>) => show(modalId, args),
    [modalId]
  );
  const hideCallback = useCallback(() => hide(modalId), [modalId]);

  useEffect(() => {
    if (isUseComponent && !MODAL_REGISTRY[modalId]) {
      register(modalId, modal as React.FC, args);
    }
  }, [isUseComponent, modalId, modal, args]);

  return useMemo(
    () => ({
      id: modalId,
      args: modalInfo?.args,
      visible: !!modalInfo?.visible,
      keepMounted: !!modalInfo?.keepMounted,
      show: showCallback,
      hide: hideCallback,
    }),
    [
      modalId,
      modalInfo?.args,
      modalInfo?.visible,
      modalInfo?.keepMounted,
      showCallback,
      hideCallback,
    ]
  );
};

export const createModal = <P extends {}>(
  Component: React.ComponentType<P>
) => {
  return ({ defaultVisible, keepMounted, id, ...props }) => {
    const { args, show } = useModal(id);
    // If there's modal state, then should mount it.
    const modals = useContext(MyModalContext);
    const shouldMount = !!modals[id];

    useEffect(() => {
      // If defaultVisible, show it after mounted.
      if (defaultVisible) {
        show();
      }

      ALREADY_MOUNTED[id] = true;

      return () => {
        delete ALREADY_MOUNTED[id];
      };
    }, [id, show, defaultVisible]);

    useEffect(() => {
      if (keepMounted) setFlags(id, { keepMounted: true });
    }, [id, keepMounted]);

    const delayVisible = modals[id]?.delayVisible;
    // If modal.show is called
    //  1. If modal was mounted, should make it visible directly
    //  2. If modal has not been mounted, should mount it first, then make it visible
    useEffect(() => {
      if (delayVisible) {
        // delayVisible: false => true, it means the modal.show() is called, should show it.
        show(args);
      }
    }, [delayVisible, args, show]);

    if (!shouldMount) return null;

    return (
      <MyModalIdContext.Provider value={id}>
        <Component {...(props as P)} {...args} />
      </MyModalIdContext.Provider>
    );
  };
};

// The placeholder component is used to auto render modals when call modal.show()
// When modal.show() is called, it means there've been modal info
const NiceModalPlaceholder: React.FC = () => {
  const modals = useContext(MyModalContext);
  const visibleModalIds = Object.keys(modals).filter((id) => !!modals[id]);
  visibleModalIds.forEach((id) => {
    if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
      console.warn(
        `No modal found for id: ${id}. Please check the id or if it is registered or declared via JSX.`
      );
      return;
    }
  });

  const toRender = visibleModalIds
    .filter((id) => MODAL_REGISTRY[id])
    .map((id) => ({
      id,
      ...MODAL_REGISTRY[id],
    }));

  return (
    <>
      {toRender.map((t) => (
        <t.comp key={t.id} id={t.id} {...t.props} />
      ))}
    </>
  );
};

export const InnerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const arr = useReducer(reducer, initialState);
  const modals = arr[0];
  dispatch = arr[1];
  return (
    <MyModalContext.Provider value={modals}>
      {children}
      <NiceModalPlaceholder />
    </MyModalContext.Provider>
  );
};
