import { useCallback, useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import FirebaseNotice from '../components/FirebaseNotice';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import StatsCard from '../components/StatsCard';
import StatusBanner from '../components/StatusBanner';
import SubjectCard from '../components/SubjectCard';
import SubjectForm from '../components/SubjectForm';
import SummaryGenerator from '../components/SummaryGenerator';
import { useAuth } from '../hooks/useAuth';
import { useSubjects } from '../hooks/useSubjects';
import { formatMinutes } from '../services/formatters';

export default function DashboardPage() {
  const { user } = useAuth();
  const { subjects, loading, hasFetched, error, addSubject, editSubject, removeSubject, clearError } =
    useSubjects(user?.uid);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);
  const [subjectBusy, setSubjectBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const stats = useMemo(() => {
    const totalSessions = subjects.reduce((sum, subject) => sum + (subject.sessionCount || 0), 0);
    const totalMinutes = subjects.reduce((sum, subject) => sum + (subject.totalDuration || 0), 0);
    const averageMinutes = subjects.length ? Math.round(totalMinutes / subjects.length) : 0;

    return {
      totalSubjects: subjects.length,
      totalSessions,
      totalMinutes,
      averageMinutes,
    };
  }, [subjects]);

  const openCreateModal = useCallback(() => {
    setActiveSubject(null);
    setActionError('');
    setIsSubjectModalOpen(true);
  }, []);

  const openEditModal = useCallback((subject) => {
    setActiveSubject(subject);
    setActionError('');
    setIsSubjectModalOpen(true);
  }, []);

  const closeSubjectModal = useCallback(() => {
    setIsSubjectModalOpen(false);
    setActiveSubject(null);
    setActionError('');
  }, []);

  const handleSubjectSubmit = useCallback(
    async (formValues) => {
      setSubjectBusy(true);
      setActionError('');

      try {
        if (activeSubject) {
          await editSubject(activeSubject.id, formValues);
        } else {
          await addSubject(formValues);
        }
        closeSubjectModal();
      } catch (submitError) {
        setActionError(submitError.message);
      } finally {
        setSubjectBusy(false);
      }
    },
    [activeSubject, addSubject, closeSubjectModal, editSubject],
  );

  const handleDeleteSubject = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteBusy(true);
    setActionError('');

    try {
      await removeSubject(deleteTarget.id);
      setDeleteTarget(null);
    } catch (deleteError) {
      setActionError(deleteError.message);
    } finally {
      setDeleteBusy(false);
    }
  }, [deleteTarget, removeSubject]);

  const showSubjectsLoading = loading && !hasFetched;

  return (
    <AppShell
      title="Dashboard"
      subtitle="Stay on top of your study plan with fast subject management, session tracking, and quick AI-assisted revision."
      actions={
        <button type="button" onClick={openCreateModal} className="btn-primary">
          Add subject
        </button>
      }
    >
      <div className="space-y-6">
        <FirebaseNotice />
        <StatusBanner kind="error" message={error || actionError} onDismiss={() => {
          clearError();
          setActionError('');
        }} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Subjects"
            value={stats.totalSubjects}
            helper="Organized across your personal workspace"
            tone="default"
          />
          <StatsCard
            label="Study Sessions"
            value={stats.totalSessions}
            helper="All sessions logged in Firestore"
            tone="accent"
          />
          <StatsCard
            label="Total Time"
            value={formatMinutes(stats.totalMinutes)}
            helper="Your full tracked study duration"
            tone="warm"
          />
          <StatsCard
            label="Avg Per Subject"
            value={formatMinutes(stats.averageMinutes)}
            helper="Average time invested per subject"
            tone="default"
          />
        </section>

        <SummaryGenerator />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your subjects</h2>
              <p className="text-sm text-slate-600">
                Create, edit, and review every study area from one place.
              </p>
            </div>
          </div>

          {showSubjectsLoading ? (
            <LoadingSpinner label="Loading your subjects..." />
          ) : subjects.length ? (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onEdit={openEditModal}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No subjects yet"
              description={`No subjects yet. Click 'Add Subject' to get started.`}
              action={
                <button type="button" onClick={openCreateModal} className="btn-primary">
                  Add Subject
                </button>
              }
            />
          )}
        </section>
      </div>

      {isSubjectModalOpen ? (
        <Modal
          title={activeSubject ? 'Edit subject' : 'Add a new subject'}
          description="Keep the description practical so you can quickly remember what belongs in this subject."
          onClose={closeSubjectModal}
        >
          <div className="space-y-4">
            <StatusBanner kind="error" message={actionError} onDismiss={() => setActionError('')} />
            <SubjectForm
              initialValues={
                activeSubject
                  ? {
                      title: activeSubject.title,
                      description: activeSubject.description,
                    }
                  : undefined
              }
              onSubmit={handleSubjectSubmit}
              onCancel={closeSubjectModal}
              submitLabel={activeSubject ? 'Update subject' : 'Create subject'}
              busy={subjectBusy}
            />
          </div>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title="Delete subject"
          description={`This will remove "${deleteTarget.title}" and all of its study sessions.`}
          onClose={() => setDeleteTarget(null)}
        >
          <ConfirmDialog
            title="Delete subject"
            description="This action cannot be undone. The subject document and its nested sessions will be deleted from Firestore."
            confirmLabel="Delete subject"
            onConfirm={handleDeleteSubject}
            onCancel={() => setDeleteTarget(null)}
            busy={deleteBusy}
          />
        </Modal>
      ) : null}
    </AppShell>
  );
}
