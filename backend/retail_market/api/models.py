import json
import logging

from django.core.serializers.json import DjangoJSONEncoder
from django.db import models

from core.managers.non_deleted_manager import NonDeletedManager


class Seen(Exception):
    pass


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    objects = NonDeletedManager()
    include_deleted = models.Manager()

    class Meta:
        abstract = True


    def shift_paths(self, exclude, name):
        return tuple(item.split('.', 1)[1] for item in exclude
                     if item.startswith(('{0}.'.format(name), '*.')))

    @staticmethod
    def is_jsonable(x):
        try:
            json.dumps(x, cls=DjangoJSONEncoder)
            return True
        except TypeError:
            return False

    def deep_dump_instance(self,
                           depth,
                           seen):
        """
            Deep-dumps fields of a model instance as a json serializable dict
        """
        if (self.__class__, self.pk) in seen:
            raise Seen()
        seen.add((self.__class__, self.pk))
        field_names = sorted(
            [field.name for field in self._meta.fields] + [field.name for field in self._meta.related_objects])

        dump = dict()
        for name in field_names:
            should_we_add = True
            try:
                value = getattr(self, name)
            except models.ObjectDoesNotExist:
                value = None
            except AttributeError:
                logging.error(f"object {self} of {self.__class__} does not have attribute {name}")
                continue
            if depth >= 1:
                try:
                    related_objects = value.all()
                    value = []
                    for related in related_objects:
                        try:
                            value.append(related.deep_dump_instance(
                                depth=depth - 1,
                                seen=seen))
                        except Seen:
                            pass
                except AttributeError:
                    pass
                try:
                    value = value.deep_dump_instance(
                                               depth=depth - 1,
                                               seen=seen)
                except Seen:
                    should_we_add = False
                except AttributeError:
                    pass
                if self.is_jsonable(value) and should_we_add:
                    dump[name] = value
                else:
                    logging.info(f"not json serializable: key:{name} value:{value}")
        return dump

    def deep_dump_flattened_instance(self, depth, seen):
        """
            Dumps flattened fields of a model instance as a json serializable dict, doesn't include related objects
        """
        seen.add((self.__class__, self.pk))
        field_names = sorted(
            [field.name for field in self._meta.fields])

        dump = dict()
        for name in field_names:
            try:
                value = getattr(self, name)
            except models.ObjectDoesNotExist:
                value = None
            except AttributeError:
                logging.error(f"object {self} of {self.__class__} does not have attribute {name}")
                continue
            if depth >= 1:
                try:
                    flattened_dump = value.deep_dump_flattened_instance(depth=depth - 1, seen=seen)
                    for k, v in flattened_dump.items():
                        dump[f"{name}_{k}"] = v
                except Seen:
                    continue
                except AttributeError:
                    if self.is_jsonable(value):
                        dump[name] = value
                    else:
                        logging.info(f"not json serializable: key:{name} value:{value}")
        return dump
