#ifndef SINGLETON_H
#define SINGLETON_H

// See also here; https://wiki.qt.io/Qt_thread-safe_singleton (removed 20181211)

#include "call_once.h"

#include <QtGlobal>
#include <QScopedPointer>
#include <QAtomicPointer>

// ----------------------------------------------------------------------------
template <class T> class Singleton {

private:
  //typedef T* (*CreateInstanceFunction)();
  using CreateInstanceFunction = T *(*)();

public:
  static T* instance(CreateInstanceFunction create);

private:
  static void init();

  Singleton();
  ~Singleton();

  Q_DISABLE_COPY(Singleton)
  static QBasicAtomicPointer<void> create;
  static QBasicAtomicInt flag;
  static QBasicAtomicPointer<void> tptr;
  bool inited;
};

template <class T> T* Singleton<T>::instance(CreateInstanceFunction create) {
  Singleton::create.store(reinterpret_cast<void *>(create));
  qCallOnce( init, flag);
  //return (T*)tptr.load();
  return reinterpret_cast<T*>(tptr.load());
}

template <class T> void Singleton<T>::init() {
  static Singleton singleton;
  if ( singleton.inited ) {
//    CreateInstanceFunction createFunction = (CreateInstanceFunction)Singleton::create.load();
    CreateInstanceFunction createFunction = reinterpret_cast<CreateInstanceFunction>(Singleton::create.load());
    tptr.store(createFunction());
  }
}

template <class T> Singleton<T>::Singleton() {
  inited = true;
};

template <class T> Singleton<T>::~Singleton() {
  //T* createdTptr = (T*)tptr.fetchAndStoreOrdered(nullptr);
  T* createdTptr = reinterpret_cast<T*>(tptr.fetchAndStoreOrdered(nullptr));
  if ( createdTptr ) {
    delete createdTptr;
  }
  create.store(nullptr);
}

template<class T> QBasicAtomicPointer<void> Singleton<T>::create = Q_BASIC_ATOMIC_INITIALIZER(nullptr);
template<class T> QBasicAtomicInt Singleton<T>::flag = Q_BASIC_ATOMIC_INITIALIZER(CallOnce::CO_Request);
template<class T> QBasicAtomicPointer<void> Singleton<T>::tptr = Q_BASIC_ATOMIC_INITIALIZER(nullptr);

#endif // SINGLETON_H
